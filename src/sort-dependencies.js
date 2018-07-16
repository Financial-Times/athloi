const { solve } = require('dependency-solver');

module.exports = (packages = []) => {
	const packageNames = new Set(packages.map((package) => package.name));

	const edges = packages.reduce((output, package) => {
		output[package.name] = package.allDependencies.filter((dependencyName) => {
			return packageNames.has(dependencyName);
		});

		return output;
	}, {});

	// <https://en.wikipedia.org/wiki/Topological_sorting>
	const order = solve(edges);

	return order.map((packageName) => {
		return packages.find((package) => package.name === packageName);
	});
};
