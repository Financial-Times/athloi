const Package = require('./package');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');

module.exports = async (globs = []) => {
	const locations = await getPackages(globs);
	const packages = [];

	locations.forEach((location) => {
		const manifest = loadManifest(location);

		if (manifest) {
			if (packages.some((pkg) => manifest.name === pkg.name)) {
				throw Error(`Two or more packages have been found with the same name: "${manifest.name}"`);
			} else {
				packages.push(new Package(manifest, location));
			}
		}
	});

	return packages;
};
