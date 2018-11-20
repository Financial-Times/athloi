module.exports = (filter, packages = []) => (
	filter
		? packages.filter(({ manifest }) => {
			if (filter.includes(':')) {
				const [key, value] = filter.split(':');
				return manifest[key] === JSON.parse(value);
			} else {
				// By default filter on the package name
				return manifest.name.split('/').slice(-1)[0] === filter;
			}
		})
		: packages
);
