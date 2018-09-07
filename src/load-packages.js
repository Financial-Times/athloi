const Package = require('./package');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');

module.exports = async (globs = []) => {
	const locations = await getPackages(globs);

	return locations.map((location) => {
		const manifest = loadManifest(location);
		return new Package(manifest, location);
	});
};
