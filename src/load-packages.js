const logger = require('./logger');
const Package = require('./package');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');

module.exports = async (globs = []) => {
	const locations = await getPackages(globs);
	const packages = [];

	locations.forEach(location => {
		let manifest;

		try {
			manifest = loadManifest(location);
		} catch (error) {
			logger.warning(error.toString());
		}

		if (manifest) {
			if (packages.some(pkg => manifest.name === pkg.name)) {
				throw new Error(
					`Two or more packages have been found with the same name: "${manifest.name}"`,
				);
			} else {
				packages.push(new Package(manifest, location));
			}
		}
	});

	return packages;
};
