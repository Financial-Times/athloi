const clone = (src) => JSON.parse(JSON.stringify(src));

const targetProperties = [
	'dependencies',
	'devDependencies',
	'peerDependencies',
	'optionalDependencies'
];

module.exports = (manifest, number, localDependencies = []) => {
	const pkg = clone(manifest);

	pkg.version = number;

	const range = `^${number}`;

	for (const packageName of localDependencies) {
		for (const targetProperty of targetProperties) {
			const version = pkg[targetProperty] && pkg[targetProperty][packageName];

			// Only update dependencies using relative package paths
			if (version && /^file:/.test(version)) {
				pkg[targetProperty][packageName] = range;
			}
		}
	}

	return pkg;
};
