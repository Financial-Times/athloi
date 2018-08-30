const rimraf = require('../rimraf');
const taskify = require('../cli-task');
const { filterOption } = require('../filter');

function clean (packages = []) {
	return packages.map((pkg) => {
		return () => rimraf(pkg.nodeModulesLocation);
	});
};

module.exports.register = (program) => {
	program
		.command('clean')
		.description('Removes the node_modules directory from all packages')
		.option(filterOption.join(','))
		.action(taskify(clean));
};
