const path = require('path');

module.exports = (packagePath) => {
	const manifestPath = path.resolve(packagePath, 'package.json');
	const manifestJSON = require(manifestPath);

	// Append package path for referencing later
	manifestJSON.packagePath = packagePath;

	return manifestJSON;
};
