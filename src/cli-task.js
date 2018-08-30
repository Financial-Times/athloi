const logger = require('./logger');
const Stopwatch = require('./stopwatch');
const runSeries = require('./run-series');
const loadConfig = require('./load-config');
const loadPackages = require('./load-packages');
const { applyFilter } = require('./filter');

module.exports = (task) => {
	const timer = new Stopwatch();

	return async (cmd, options) => {
		try {
			timer.start();

			// 1. load the root monorepo config
			const config = await loadConfig();

			// 2. find all packages by path and create package instances
			const packages = await loadPackages(config.packages);

			// 3. filter packages where to run based on options.filter and get the options without the filter
			const { filteredPackages, parsedOptions } = applyFilter(options, packages);

			logger.info(`Loaded ${filteredPackages.length} packages:`);
			filteredPackages.map((pkg) => logger.message(`- ${pkg.relativeLocation}`));

			// 4. create a queue of tasks to run
			const tasks = await Reflect.apply(task, null, [packages, cmd, parsedOptions]);

			logger.info(`Running ${tasks.length} tasks in series`);

			// 5. execute all tasks in series
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
