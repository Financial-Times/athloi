const clone = (src) => JSON.parse(JSON.stringify(src));

const targetProperties = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'optionalDependencies'
];

// link: specifiers are used by Yarn and will supported by npm in future
const targetSpecifiers = /^(file:|link:)/

module.exports = (manifest, targetDependencies, targetNumber, latestVersions) => {
	const pkg = clone(manifest);

	pkg.version = targetNumber;

	targetProperties.forEach((targetProperty) => {
		const dependencies = pkg[targetProperty] || {};
		const dependencyNames = Object.keys(dependencies);

		dependencyNames.forEach((dependencyName) => {
			const version = dependencies[dependencyName];

			// Only update dependencies using relative package paths
			if (version && targetSpecifiers.test(version)) {
				if (targetDependencies.has(dependencyName)) {
					dependencies[dependencyName] = `^${targetNumber}`;
				} else if (latestVersions.has(dependencyName)) {
					dependencies[dependencyName] = `^${latestVersions.get(dependencyName)}`;
				}
			}
		});
	});

	return pkg;
};
