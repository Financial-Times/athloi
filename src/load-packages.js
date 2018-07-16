const Package = require('./package');
const loadConfig = require('./load-config');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');

module.exports = async () => {
	// 1. load the root monorepo config
	const config = await loadConfig();

	// 2. find all packages by path
	const locations = await getPackages(config.packages);

	// 3. load the package manifests and create package instances
	return locations.map((location) => {
		const manifest = loadManifest(location);
		return new Package(manifest, location);
	});
};
