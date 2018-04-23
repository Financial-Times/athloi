const fs = require('fs-extra');
const path = require('path');

const loadPackage = pkgPath => fs.readFile(
	path.resolve(pkgPath, 'package.json')
)
.then(JSON.parse)
.then(pkg => Object.assign(pkg, {
	pkgPath
}));

module.exports = loadPackage;
