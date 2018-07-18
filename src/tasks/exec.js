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
		.description('Runs an arbitrary command in the scope of each package')
		.action(taskify(exec));
};
