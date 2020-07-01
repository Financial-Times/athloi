const findUp = require('find-up');
const loadJSON = require('./load-json');

module.exports = async () => {
	const [monorepo, manifest] = await Promise.all([
		findUp('monorepo.json'),
		findUp('package.json'),
	]);

	// Lerna style configuration file
	if (monorepo) {
		return loadJSON(monorepo).packages;
	}

	// Yarn workspaces style configuration
	if (manifest) {
		const pkg = loadJSON(manifest);

		if (Array.isArray(pkg.workspaces)) {
			return pkg.workspaces;
		}
	}

	throw new Error('Could not find any Athloi configuration');
};
