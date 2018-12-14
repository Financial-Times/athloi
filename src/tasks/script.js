const path = require('path');
const taskify = require('../cli-task');
const runPackage = require('../run-package');

function script (packages = [], scriptPath) {
	const resolvedScript = path.resolve(process.cwd(), scriptPath);

	return packages.map((pkg) => {
		const apply = () => runPackage('node', [resolvedScript], pkg.location);
		return { pkg, apply };
	});
}

exports.task = script;

exports.register = (program) => {
	program
		.command('script <path>')
		.description('Runs the given Node script in the scope of each package')
		.action(taskify(script));
};
