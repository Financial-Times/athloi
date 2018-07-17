const toposort = require('toposort');

module.exports = (packages = []) => {
	const packageNames = new Set(packages.map((pkg) => pkg.name));

	const edges = packages.reduce((edges, pkg) => {
		const dependencies = pkg.dependencyNames.filter((dependency) => {
			return packageNames.has(dependency);
		});

		return edges.concat(dependencies.map((dependency) => [dependency, pkg.name]));
	}, []);

	const order = toposort.array(Array.from(packageNames), edges);

	return order.map((packageName) => {
		return packages.find((pkg) => pkg.name === packageName);
	});
};
