const toposort = require('toposort');

async function sortDeps(manifests) {
	const packageNames = new Set(manifests.map(({name}) => name));

	const edges = manifests.reduce(
		(edges, pkg) => {
			const deps = pkg.dependencies
				? Object.keys(pkg.dependencies).filter(
					dep => packageNames.has(dep)
				)
				: [];

			return edges.concat(
				deps.map(
					dep => [dep, pkg.name]
				)
			);
		},
		[]
	);

	return toposort.array(Array.from(packageNames), edges);
}

module.exports = sortDeps;
