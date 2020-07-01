const fs = require('fs');
const path = require('path');
const loadJSON = require('./load-json');

module.exports = packagePath => {
	const stats = fs.statSync(packagePath);

	if (stats.isDirectory()) {
		const manifestPath = path.resolve(packagePath, 'package.json');

		if (fs.existsSync(manifestPath)) {
			return loadJSON(manifestPath);
		}

		throw new Error(
			`Folder found without package.json file: ${packagePath}`,
		);
	}
};
