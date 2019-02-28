const clone = (src) => JSON.parse(JSON.stringify(src));

const targetProperties = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'optionalDependencies'
];

// link: specifiers are used by Yarn and will supported by npm in future
const localSpecifiers = /^(file:|link:)/

module.exports = (manifest, packagesToUpdate, targetNumber, fallbackVersions) => {
	const pkg = clone(manifest);

	pkg.version = targetNumber;

	targetProperties.forEach((targetProperty) => {
		const dependencies = pkg[targetProperty] || {};
		const dependencyNames = Object.keys(dependencies);

		dependencyNames.forEach((dependencyName) => {
			const version = dependencies[dependencyName];

			// Only update dependencies using relative package paths
			if (version && localSpecifiers.test(version)) {
				if (packagesToUpdate.has(dependencyName)) {
					dependencies[dependencyName] = `^${targetNumber}`;
				} else if (fallbackVersions.has(dependencyName)) {
					dependencies[dependencyName] = `^${fallbackVersions.get(dependencyName)}`;
				}
			}
		});
	});

	return pkg;
};
