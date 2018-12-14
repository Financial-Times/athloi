const logger = require('../logger');
const taskify = require('../cli-task');
const runPackage = require('../run-package');

function run (packages = [], script) {
	// filter out packages without the requested command
	const filteredPackages = packages.filter(({ manifest }) => {
		return manifest.scripts && manifest.scripts.hasOwnProperty(script);
	});

	logger.message(`Found ${filteredPackages.length} packages with script`);

	// create a queue of tasks to run
	return filteredPackages.map((pkg) => {
		const apply = () => runPackage('npm', ['run', script], pkg.location);
		return { pkg, apply };
	});
};

exports.task = run;

exports.register = (program) => {
	program
		.command('run <script>')
		.description('Runs an npm script in each package that contains that script.')
		.action(taskify(run));
};
