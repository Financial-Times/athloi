const rimraf = require('../rimraf');
const taskify = require('../cli-task');

function clean (packages = []) {
	return packages.map((pkg) => {
		return () => rimraf(pkg.nodeModulesLocation);
	});
};

module.exports.register = (program) => {
	program
		.command('clean')
		.description('Remove the node_modules directory from all packages.')
		.action(taskify(clean));
};
