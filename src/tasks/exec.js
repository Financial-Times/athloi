const taskify = require('../cli-task');
const runPackage = require('../run-package');

async function exec (packages = [], command, args = []) {
	return packages.map((pkg) => {
		return () => runPackage(command, args, pkg.location);
	});
};

module.exports.register = (program) => {
	program
		.command('exec <path> [args...]')
		.description('Run an arbitrary command in each package.')
		.action(taskify(exec));
};
