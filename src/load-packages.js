const Package = require('./package');
const getPackages = require('./get-packages');
const loadManifest = require('./load-manifest');
const sortDependencies = require('./sort-dependencies');

module.exports = async (globs = []) => {
	const locations = await getPackages(globs);

	const packages = locations.map((location) => {
		const manifest = loadManifest(location);
		return new Package(manifest, location);
	});

	return sortDependencies(packages);
};
