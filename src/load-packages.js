const Package = require('./package');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');

module.exports = async (globs = []) => {
	const locations = await getPackages(globs);
	const packages = []

	locations.forEach((location) => {
		const manifest = loadManifest(location);

		if (manifest) {
			packages.push(new Package(manifest, location));
		}
	});

	return packages
};
