const { promisify } = require('util');
const glob = promisify(require('glob'));

module.exports = (patterns = []) => {
	const opts = { realpath: true };
	return glob(patterns.length > 1 ? `{${patterns.join(',')}}` : patterns[0], opts);
};
