const findUp = require('find-up');

module.exports = async () => {
	const [ monorepo, manifest ] = await Promise.all([
		findUp('monorepo.json'),
		findUp('package.json')
	]);

	// Lerna style configuration file
	if (monorepo) {
		return require(monorepo).packages;
	}

	// Yarn workspaces style configuration
	if (manifest) {
		const pkg = require(manifest);

		if (Array.isArray(pkg.workspaces)) {
			return pkg.workspaces;
		}
	}

	throw Error('Could not find any Athloi configuration');
};
