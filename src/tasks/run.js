const logger = require('../logger');
const runSeries = require('../run-series');
const runPackage = require('../run-package');
const loadPackages = require('../load-packages');
const sortDependencies = require('../sort-dependencies');

async function run (script) {
	// 1. load all of the manifests for packages in the repo
	const packages = await loadPackages();

	logger.info(`Loaded ${packages.length} packages`);

	// 2. filter out packages without the requested command
	const filteredPackages = packages.filter((pkg) => {
		return pkg.scripts.hasOwnProperty(script);
	});

	logger.message(`Found ${filteredPackages.length} packages with script`);

	// 3. sort the packages topologically
	const packagesInOrder = sortDependencies(filteredPackages);

	// 4. create a queue of tasks to run
	const taskQueue = packagesInOrder.map((pkg) => {
		return () => runPackage('npm', ['run', script], pkg.location);
	});

	// 5. run each task in series
	return runSeries(taskQueue);
};

module.exports.register = (program) => {
	program
		.command('run <command>')
		.description('Run an npm script in each package that contains that script.')
		.action(run); // TODO: handle errors
};
