const runPackage = require('./run-package');
const loadPackagesWithScript = require('./load-packages-with-script');

module.exports = async function(script, packages) {
	const packagesWithScript = await loadPackagesWithScript(packages, script);

	return Promise.all(packagesWithScript.map(
		({pkgPath}) => runPackage(script, pkgPath)
	));
};
