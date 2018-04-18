const runPackage = require('../run-package');
const toposort = require('toposort');
const fs = require('fs-extra');
const path = require('path');
const keyBy = require('lodash.keyby');
const mapValues = require('lodash.mapvalues');

const loadPackage = pkgPath => fs.readFile(
	path.resolve(pkgPath, 'package.json')
)
.then(JSON.parse)
.then(pkg => Object.assign(pkg, {
	pkgPath
}));

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

exports.run = async function({packages}) {
	const manifests = await Promise.all(
		packages.map(loadPackage)
	);

	const namesToPaths = mapValues(
		keyBy(manifests, 'name'),
		manifest => manifest.pkgPath
	);

	const packagesWithBuild = manifests.filter(
		pkg => pkg.scripts && 'build' in pkg.scripts
	);

	const order = await sortDeps(packagesWithBuild);

	for(const pkg of order) {
		await runPackage('build', namesToPaths[pkg]);
	}
};
