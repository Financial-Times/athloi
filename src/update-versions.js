const clone = (src) => JSON.parse(JSON.stringify(src));

const targetProperties = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'optionalDependencies'
];

// link: specifiers are used by Yarn and will supported by npm in future
const targetSpecifiers = /^(file:|link:)/

module.exports = (manifest, number, useExactNumber, localDependencies = []) => {
	const pkg = clone(manifest);

	pkg.version = number;

	const range = useExactNumber ? number : `^${number}`;

	for (const packageName of localDependencies) {
		for (const targetProperty of targetProperties) {
			const version = pkg[targetProperty] && pkg[targetProperty][packageName];

			// Only update dependencies using relative package paths
			if (version && targetSpecifiers.test(version)) {
				pkg[targetProperty][packageName] = range;
			}
		}
	}

	return pkg;
};
