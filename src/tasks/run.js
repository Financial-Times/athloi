const logger = require('../logger');
const taskify = require('../cli-task');
const runPackage = require('../run-package');
const { filterOption } = require('../filter');

async function run (packages = [], script) {
	// filter out packages without the requested command
	const filteredPackages = packages.filter(({ manifest }) => {
		return manifest.scripts && manifest.scripts.hasOwnProperty(script);
	});

	logger.message(`Found ${filteredPackages.length} packages with script`);

	// create a queue of tasks to run
	return filteredPackages.map((pkg) => {
		return () => runPackage('npm', ['run', script], pkg.location);
	});
};

module.exports.register = (program) => {
	program
		.command('run <script>')
		.description('Runs an npm script in each package that contains that script.')
		.option(filterOption.join(','))
		.action(taskify(run));
};
