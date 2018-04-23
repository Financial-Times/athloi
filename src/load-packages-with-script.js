const loadPackage = require('./load-package');

async function loadPackagesWithScript(packages, script) {
	const manifests = await Promise.all(
		packages.map(loadPackage)
	);

	const packagesWithScript = manifests.filter(
		pkg => pkg.scripts && script in pkg.scripts
	);

	return packagesWithScript;
}

module.exports = loadPackagesWithScript;
