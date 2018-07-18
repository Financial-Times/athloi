const clone = require('clone');

module.exports = (manifest, version, localDependencies = []) => {
	const pkg = clone(manifest);

	pkg.version = version;

	for (const packageName of localDependencies) {
		if (pkg.dependencies && pkg.dependencies[packageName]) {
			pkg.dependencies[packageName] = version;
		}
		if (pkg.devDependencies && pkg.devDependencies[packageName]) {
			pkg.devDependencies[packageName] = version;
		}
		if (pkg.peerDependencies && pkg.peerDependencies[packageName]) {
			pkg.peerDependencies[packageName] = version;
		}
		if (pkg.optionalDependencies && pkg.optionalDependencies[packageName]) {
			pkg.optionalDependencies[packageName] = version;
		}
	}

	return pkg;
};
