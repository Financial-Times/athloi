const path = require('path');
const logger = require('../logger');
const rimraf = require('../rimraf');
const runSeries = require('../run-series');
const loadPackages = require('../load-packages');

async function clean () {
	// 1. load all of the manifests for packages in the repo
	const packages = await loadPackages();

	logger.info(`Loaded ${packages.length} packages`);

	// 2. create a queue of tasks to run
	const taskQueue = packages.map((pkg) => {
		return () => rimraf(path.join(pkg.location, 'node_modules'));
	});

	// 3. run each task in series
	return runSeries(taskQueue);
};

module.exports.register = (program) => {
	program
		.command('clean')
		.description('Remove the node_modules directory from all packages.')
		.action(clean); // TODO: handle errors
};
