const toposort = require('toposort');

const collateDependencies = (manifest) => {
	// TODO: refactor into package class
	return Object.keys({
		...manifest.dependencies,
		...manifest.devDependencies,
		...manifest.peerDependencies,
		...manifest.optionalDependencies
	});
};

module.exports = (reverse = false, packages = []) => {
	const packageNames = new Set(packages.map((pkg) => pkg.name));

	const edges = packages.reduce((edges, pkg) => {
		const dependencyNames = collateDependencies(pkg.manifest);

		const localDependencies = dependencyNames.filter((dependency) => {
			return packageNames.has(dependency);
		});

		return edges.concat(localDependencies.map((dependency) => [dependency, pkg.name]));
	}, []);

	const order = toposort.array(Array.from(packageNames), edges);

	if (reverse) {
		order.reverse();
	}

	return order.map((packageName) => {
		return packages.find((pkg) => pkg.name === packageName);
	});
};
