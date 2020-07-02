const minimatch = require('minimatch');

const testKeyValue = (a, b) => {
	if (Array.isArray(a) && typeof b === 'string') {
		return a.includes(b);
	}

	if (typeof a === 'object' && typeof b === 'string') {
		return Object.prototype.hasOwnProperty.call(a, b);
	}

	return a === b;
};

const testPackageName = (fullName, filter) => {
	// Ignore the organisation name
	const packageName = fullName.startsWith('@')
		? fullName.split('/').pop()
		: fullName;

	return minimatch(packageName, filter);
};

module.exports = (filter, packages = []) =>
	filter
		? packages.filter(({ manifest }) => {
				if (filter.includes(':')) {
					const [key, value] = filter.split(':');
					return testKeyValue(manifest[key], JSON.parse(value));
				}
				// By default filter on the package name
				return testPackageName(manifest.name, filter);
		  })
		: packages;
