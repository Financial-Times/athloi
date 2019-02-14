const fs = require('fs');
const path = require('path');

module.exports = (packagePath) => {
	const stats = fs.statSync(packagePath);

	if (stats.isDirectory()) {
		const manifestPath = path.resolve(packagePath, 'package.json');

		if (fs.existsSync(manifestPath)) {
			return require(manifestPath);
		} else {
			throw Error(`Folder found without package.json file: ${packagePath}`)
		}
	}
};
