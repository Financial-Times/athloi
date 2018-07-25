const logger = require('../logger');
const taskify = require('../cli-task');
const runPackage = require('../run-package');

async function publish (packages = [], args = []) {
	// filter out any private packages
	const filteredPackages = packages.filter((pkg) => pkg.private);

	logger.message(`Found ${filteredPackages.length} packages to publish`);

	// create a queue of tasks to run
	return filteredPackages.map((pkg) => {
		return () => runPackage('npm', ['publish', ...args], pkg.location);
	});
};

module.exports.register = (program) => {
	program
		.command('publish [args...]')
		.description('Runs npm publish in the scope of each public package')
		.action(taskify(publish));
};
