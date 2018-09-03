const logger = require('./logger');
const Stopwatch = require('./stopwatch');
const loadConfig = require('./load-config');
const runParallel = require('./run-parallel');
const loadPackages = require('./load-packages');
const filterPackages = require('./filter-packages');

module.exports = (task) => {
	const timer = new Stopwatch();

	return async (...args) => {
		// The final argument is always the command instance
		const command = args[args.length - 1];
		const options = args.slice(0, -1);
		const globals = command.parent.opts();

		try {
			timer.start();

			// 1. load the root monorepo config
			const config = await loadConfig();

			// 2. find all packages by path and create package instances
			const packages = await loadPackages(config.packages);

			// 3. filter packages where to run based on options.filter and get the options without the filter
			const filteredPackages = filterPackages(globals.filter, packages);

			logger.info(`Loaded ${filteredPackages.length} packages:`);
			filteredPackages.map((pkg) => logger.message(`- ${pkg.relativeLocation}`));

			// 4. create a queue of tasks to run
			const tasks = await Reflect.apply(task, null, [filteredPackages, ...options]);

			logger.info(`Running ${tasks.length} tasks`);

			// 5. execute all tasks
			await runParallel(tasks, globals.concurrency);

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
