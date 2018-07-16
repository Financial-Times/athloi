const { solve } = require('dependency-solver');

module.exports = (packages = []) => {
	const packageNames = new Set(packages.map((pkg) => pkg.name));

	const edges = packages.reduce((output, pkg) => {
		output[pkg.name] = pkg.allDependencies.filter((dependencyName) => {
			return packageNames.has(dependencyName);
		});

		return output;
	}, {});

	// <https://en.wikipedia.org/wiki/Topological_sorting>
	const order = solve(edges);

	return order.map((packageName) => {
		return packages.find((pkg) => pkg.name === packageName);
	});
};
