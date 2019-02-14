const fs = require('fs');
const path = require('path');

module.exports = (packagePath) => {
	const manifestPath = path.resolve(packagePath, 'package.json');

	if (fs.existsSync(manifestPath)) {
		return require(manifestPath);
	}
};
