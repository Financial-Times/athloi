const path = require('path');
const logger = require('../logger');
const runSeries = require('../run-series');
const runPackage = require('../run-package');
const loadPackages = require('../load-packages');
const sortDependencies = require('../sort-dependencies');

async function script (scriptPath) {
	// 1. load all of the manifests for packages in the repo
	const packages = await loadPackages();

	logger.info(`Loaded ${packages.length} packages`);

	// 2. sort the packages topologically
	const packagesInOrder = sortDependencies(packages);

	// 3. solve path to script file
	const resolvedScript = path.resolve(process.cwd(), scriptPath);

	// 4. create a queue of tasks to run
	const taskQueue = packagesInOrder.map((pkg) => {
		return () => runPackage('node', [resolvedScript], pkg.location);
	});

	// 5. run each task in series
	return runSeries(taskQueue);
};

module.exports.register = (program) => {
	program
		.command('script <path>')
		.description('Run a Node script in each package.')
		.action(script); // TODO: handle errors
};
