const { solve } = require('dependency-solver');

const collateDependencies = (manifest) => {
	return Object.keys({
		...manifest.dependencies,
		...manifest.devDependencies,
		...manifest.peerDependencies,
		...manifest.optionalDependencies,
	});
};

module.exports = (manifests = []) => {
	const packageNames = new Set(manifests.map((manifest) => manifest.name));

	const edges = manifests.reduce((output, manifest) => {
		const dependencies = collateDependencies(manifest);

		output[manifest.name] = dependencies.filter((dependency) => {
			return packageNames.has(dependency);
		});

		return output;
	}, {});

	// <https://en.wikipedia.org/wiki/Topological_sorting>
	return solve(edges);
};
