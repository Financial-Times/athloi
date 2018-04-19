const runPackage = require('./run-package');
const loadPackagesWithScript = require('./load-packages-with-script');
const logPackages = require('./log-packages');

module.exports = async function(script, packages) {
	const packagesWithScript = await loadPackagesWithScript(packages, script);

	if(logPackages(script, packagesWithScript.map(({name}) => name), true)) {
		return Promise.all(packagesWithScript.map(
			({pkgPath}) => runPackage(script, pkgPath)
		));
	}
};
