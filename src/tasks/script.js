const path = require('path');
const taskify = require('../cli-task');
const runPackage = require('../run-package');

async function script (packages = [], scriptPath) {
	// solve path to script file
	const resolvedScript = path.resolve(process.cwd(), scriptPath);

	return packages.map((pkg) => {
		return () => runPackage('node', [resolvedScript], pkg.location);
	});
};

module.exports.register = (program) => {
	program
		.command('script <path>')
		.description('Run a Node script in each package.')
		.action(taskify(script));
};
