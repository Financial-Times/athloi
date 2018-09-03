module.exports = (options = {}, packages = []) => {
	const { filter } = options;

	return filter
		? packages.filter(({ manifest }) => {
			if (filter.indexOf(':') !== -1) {
				const [key, val] = filter.split(':');
				return manifest[key] === JSON.parse(val);
			}

			// By default filter on the package name
			return manifest.name.split('/').slice(-1)[0] === filter;
		})
		: packages;
};
