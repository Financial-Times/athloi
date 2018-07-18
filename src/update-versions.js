const clone = require('clone');

module.exports = (manifest, number, localDependencies = []) => {
	const pkg = clone(manifest);

	pkg.version = number;

	for (const packageName of localDependencies) {
		const range = `^${number}`;

		if (pkg.dependencies && pkg.dependencies[packageName]) {
			pkg.dependencies[packageName] = range;
		}
		if (pkg.devDependencies && pkg.devDependencies[packageName]) {
			pkg.devDependencies[packageName] = range;
		}
		if (pkg.peerDependencies && pkg.peerDependencies[packageName]) {
			pkg.peerDependencies[packageName] = range;
		}
		if (pkg.optionalDependencies && pkg.optionalDependencies[packageName]) {
			pkg.optionalDependencies[packageName] = range;
		}
	}

	return pkg;
};
