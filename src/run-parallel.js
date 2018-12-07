const Semaphore = require('async-sema');
const logger = require('./logger');
const waitUntil = require('./wait-until');

const noRunningDependencies = (running, dependencies) => {
	return !dependencies.some((dependency) => running.has(dependency));
};

module.exports = (tasks = [], concurrency = 1) => {
	const semaphore = new Semaphore(concurrency);

	logger.info(`Executing up to ${concurrency} tasks at a time`);

	const packagesRunning = new Set();

	return Promise.all(
		tasks.map(({ pkg, apply }) => {
			return semaphore
				.acquire()
				.then(() => {
					return waitUntil(() => {
						return noRunningDependencies(packagesRunning, pkg.allDependencies);
					});
				})
				.then(() => {
					packagesRunning.add(pkg.name);
					return apply();
				})
				.then(() => {
					packagesRunning.delete(pkg.name);
					return semaphore.release();
				});
		})
	);
};
