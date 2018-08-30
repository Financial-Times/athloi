const taskify = require('../cli-task');
const runPackage = require('../run-package');
const { filterOption } = require('../filter');

async function exec (packages = [], command, args = []) {
	return packages.map((pkg) => {
		return () => runPackage(command, args, pkg.location);
	});
};

module.exports.register = (program) => {
	program
		.command('exec <path> [args...]')
		.description('Runs an arbitrary command in the scope of each package')
		.option(filterOption.join(','))
		.action(taskify(exec));
};
