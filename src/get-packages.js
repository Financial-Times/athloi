const glob = require('glob-promise');

module.exports = packages => glob(packages.length > 1
	? `{${packages.join(',')}}`
	: packages[0]
);
