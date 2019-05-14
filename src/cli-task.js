const logger = require('./logger');
const Stopwatch = require('./stopwatch');
const loadConfig = require('./load-config');
const runParallel = require('./run-parallel');
const loadPackages = require('./load-packages');
const sortPackages = require('./sort-packages');
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
			const allPackages = await loadPackages(config);

			// 3. filter packages to run in based on filter option
			const filteredPackages = filterPackages(globals.filter, allPackages);

			// 4. sort packages topologically
			const sortedPackages = sortPackages(globals.reverse, filteredPackages);

			logger.info(`Found ${sortedPackages.length} packages:`);
			sortedPackages.map((pkg) => logger.debug(`- ${pkg.relativeLocation}`));

			// 5. create a queue of tasks to run
			// TODO: refactor argslist into named params
			const tasks = await Reflect.apply(task, null, [
				sortedPackages,
				...options,
				allPackages
			]);

			// 6. execute all tasks
			logger.info(`Running ${tasks.length} tasks up to ${globals.concurrency} tasks at a time`);
			await runParallel(tasks, globals.concurrency, globals.preserveOrder);

			timer.stop();

			logger.endWithSuccess(`Tasks complete, took ${timer.duration}s`);
		} catch (error) {
			const message = error instanceof Error ? error.message : error;
			const exitCode = Number.isInteger(error.code) ? error.code : 1;

			logger.endWithFailure(message);
			process.exit(exitCode);
		}
	};
};
