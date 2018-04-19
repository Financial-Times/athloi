const mapValues = require('lodash.mapvalues');
const keyBy = require('lodash.keyby');
const runPackage = require('./run-package');
const loadPackagesWithScript = require('./load-packages-with-script');
const sortDeps = require('./sort-deps');

module.exports = async function(script, packages) {
	const packagesWithScript = await loadPackagesWithScript(packages, script);
	const order = await sortDeps(packagesWithScript);
	const namesToPaths = mapValues(
		keyBy(packagesWithScript, 'name'),
		manifest => manifest.pkgPath
	);

	for(const pkg of order) {
		await runPackage(script, namesToPaths[pkg]);
	}
};
