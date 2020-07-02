const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = (patterns = []) => {
	if (!Array.isArray(patterns)) {
		return Promise.reject(
			new Error('Packages or workspaces configuration must be an array.'),
		);
	}

	const opts = { realpath: true };

	// <https://en.wikipedia.org/wiki/Glob_(programming)>
	return glob(
		patterns.length > 1 ? `{${patterns.join(',')}}` : patterns[0],
		opts,
	);
};
