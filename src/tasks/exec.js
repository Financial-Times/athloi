const logger = require('../logger');
const runSeries = require('../run-series');
const runPackage = require('../run-package');
const loadPackages = require('../load-packages');
const sortDependencies = require('../sort-dependencies');

async function exec (command, args = []) {
	// 1. load all of the manifests for packages in the repo
	const packages = await loadPackages();

	logger.info(`Loaded ${packages.length} packages`);

	// 2. sort the packages topologically
	const packagesInOrder = sortDependencies(packages);

	// 3. create a queue of tasks to run
	const taskQueue = packagesInOrder.map((package) => {
		return () => runPackage(command, args, package.location);
	});

	// 4. run each task in series
	return runSeries(taskQueue);
};

module.exports.register = (program) => {
	program
		.command('exec <path> [args...]')
		.description('Run an arbitrary command in each package.')
		.action(exec); // TODO: handle errors
};
