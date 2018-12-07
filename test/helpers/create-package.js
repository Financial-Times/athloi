const Package = require('../../src/package');

module.exports = (name, options = {}) => {
	const manifest = { name, ...options };
	const instance = new Package(manifest, `/Path/to/${name}`);

	instance.writeManifest = jest.fn();

	return instance;
};
