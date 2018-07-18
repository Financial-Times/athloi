const path = require('path');

module.exports = (packagePath) => {
	const manifestPath = path.resolve(packagePath, 'package.json');
	return require(manifestPath);
};
