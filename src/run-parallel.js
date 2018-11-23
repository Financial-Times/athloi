const Semaphore = require('async-sema');
const logger = require('./logger');
const waitUntil = require('./wait-until');

const noRunningDependencies = (running, dependencies) => {
	return !dependencies.some((dependency) => running.has(dependency));
};

module.exports = (packages = [], tasks = [], concurrency = 1) => {
	const semaphore = new Semaphore(concurrency);

	logger.info(`Executing up to ${concurrency} tasks at a time`);

	const packagesRunning = new Set();

	return Promise.all(
		tasks.map((task, i) => {
			// TODO: number of tasks ~= number of packages
			const packageName = packages[i].name;
			const packageManifest = packages[i].manifest;

			const allDependencies = Object.keys({
				...packageManifest.dependencies,
				...packageManifest.devDependencies,
				...packageManifest.peerDependencies,
				...packageManifest.optionalDependencies
			});

			return semaphore
				.acquire()
				.then(() => {
					return waitUntil(() => {
						return noRunningDependencies(packagesRunning, allDependencies);
					});
				})
				.then(() => {
					packagesRunning.add(packageName);
					return task();
				})
				.then(() => {
					packagesRunning.delete(packageName);
					return semaphore.release();
				});
		})
	);
};
