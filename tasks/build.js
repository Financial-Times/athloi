const runPackage = require('../run-package');

exports.run = async function({packages}) {
	// TODO: toposorting, filtering
	for(const pkg of packages) {
		await runPackage('build', pkg);
	}
};
