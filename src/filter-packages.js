const test = (a, b) => {
	if (Array.isArray(a) && typeof b === 'string') {
		return a.includes(b);
	}

	if (typeof a === 'object' && typeof b === 'string') {
		return a.hasOwnProperty(b);
	}

	return a === b;
};

module.exports = (filter, packages = []) => (
	filter
		? packages.filter(({ manifest }) => {
			if (filter.includes(':')) {
				const [key, value] = filter.split(':');
				return test(manifest[key], JSON.parse(value));
			} else {
				// By default filter on the package name
				return manifest.name.split('/').slice(-1)[0] === filter;
			}
		})
		: packages
);
