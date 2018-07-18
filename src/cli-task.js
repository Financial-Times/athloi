const logger = require('./logger');
const Stopwatch = require('./stopwatch');
const runSeries = require('./run-series');
const loadConfig = require('./load-config');
const loadPackages = require('./load-packages');

module.exports = (task) => {
	const timer = new Stopwatch();

	return async (...args) => {
		try {
			timer.start();

			// 1. load the root monorepo config
			const config = await loadConfig();

			// 2. find all packages by path and create package instances
			const packages = await loadPackages(config.packages);

			logger.info(`Loaded ${packages.length} packages:`);
			packages.map((pkg) => logger.message(`- ${pkg.relativeLocation}`));

			// 3. create a queue of tasks to run
			const tasks = await Reflect.apply(task, null, [packages, ...args]);

			logger.info(`Running ${tasks.length} tasks in series`);

			// 4. execute all tasks in series
			// TODO: support concurrent execution
			await runSeries(tasks);

			timer.stop();

			logger.message(`Tasks complete, took ${timer.duration}s`);
		} catch (error) {
			const message = error instanceof Error ? error.message : error;
			const exitCode = error.code || 1;

			logger.error(`Task failed: "${message}"`);
			process.exit(exitCode);
		}
	};
};
