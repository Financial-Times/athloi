const testValue = (a, b) => {
	if (Array.isArray(a) && typeof b === 'string') {
		return a.includes(b);
	}

	if (typeof a === 'object' && typeof b === 'string') {
		return a.hasOwnProperty(b);
	}

	return a === b;
};

const testName = (fullName, filter) => {
	// Ignore the organisation name
	const packageName = fullName.startsWith('@')
		? fullName.split('/').pop()
		: fullName;

	if (filter.endsWith('*')) {
		return packageName.startsWith(filter.replace(/\*$/, ''));
	} else {
		return packageName === filter;
	}
};

module.exports = (filter, packages = []) => (
	filter
		? packages.filter(({ manifest }) => {
			if (filter.includes(':')) {
				const [key, value] = filter.split(':');
				return testValue(manifest[key], JSON.parse(value));
			} else {
				// By default filter on the package name
				return testName(manifest.name, filter);
			}
		})
		: packages
);
