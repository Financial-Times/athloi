const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = (patterns = []) => {
	const opts = { realpath: true };
	// <https://en.wikipedia.org/wiki/Glob_(programming)>
	return glob(patterns.length > 1 ? `{${patterns.join(',')}}` : patterns[0], opts);
};
