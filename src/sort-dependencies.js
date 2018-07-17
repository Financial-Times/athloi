const toposort = require('toposort');

const collateDependencies = (manifest) => {
	return Object.keys({
		...manifest.dependencies,
		...manifest.devDependencies,
		...manifest.peerDependencies,
		...manifest.optionalDependencies
	});
};

module.exports = (packages = []) => {
	const packageNames = new Set(packages.map((pkg) => pkg.name));

	const edges = packages.reduce((edges, pkg) => {
		const dependencyNames = collateDependencies(pkg.manifest);

		const dependencies = dependencyNames.filter((dependency) => {
			return packageNames.has(dependency);
		});

		return edges.concat(dependencies.map((dependency) => [dependency, pkg.name]));
	}, []);

	const order = toposort.array(Array.from(packageNames), edges);

	return order.map((packageName) => {
		return packages.find((pkg) => pkg.name === packageName);
	});
};
