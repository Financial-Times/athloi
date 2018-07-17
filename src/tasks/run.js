const logger = require('../logger');
const taskify = require('../cli-task');
const runPackage = require('../run-package');

async function run (packages = [], script) {
	// filter out packages without the requested command
	const filteredPackages = packages.filter((pkg) => {
		return pkg.scripts.hasOwnProperty(script);
	});

	logger.message(`Found ${filteredPackages.length} packages with script`);

	// 4. create a queue of tasks to run
	return filteredPackages.map((pkg) => {
		return () => runPackage('npm', ['run', script], pkg.location);
	});
};

module.exports.register = (program) => {
	program
		.command('run <command>')
		.description('Run an npm script in each package that contains that script.')
		.action(taskify(run));
};
