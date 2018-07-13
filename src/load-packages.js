const loadConfig = require('./load-config');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');

module.exports = async () => {
	// 1. load the root monorepo config
	const config = await loadConfig();

	// 2. find all packages by path
	const packagePaths = await getPackages(config.packages);

	// 3. require all of the package manifests
	return packagePaths.map(loadManifest);
};
