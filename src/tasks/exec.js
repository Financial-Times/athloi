const logger = require('../logger');
const runSeries = require('../run-series');
const runPackage = require('../run-package');
const loadPackages = require('../load-packages');
const sortDependencies = require('../sort-dependencies');

async function exec (cmd, args = []) {
	// 1. load all of the manifests for packages in the repo
	const manifests = await loadPackages();

	logger.info(`Loaded ${manifests.length} packages`);

	// 2. sort the packages topologically
	const order = sortDependencies(manifests);

	// 3. create a queue of tasks to run
	const queue = order.map((name) => {
		const manifest = manifests.find((manifest) => manifest.name === name);
		return () => runPackage(cmd, args, manifest.packagePath);
	});

	// 4. run each task in series
	return runSeries(queue);
};

module.exports.register = (program) => {
	program
		.command('exec <path> [args...]')
		.description('Run an arbitrary command in each package.')
		.action(exec); // TODO: handle errors
};
