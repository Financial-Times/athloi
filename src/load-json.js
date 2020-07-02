const fs = require('fs');

module.exports = manifestPath => {
	return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
};
