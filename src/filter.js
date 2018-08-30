const filterOption = ['-f --filter [option]', 'Filter packages where a command should run'];
const applyFilter = (options, packages) => {
	return options.filter
		? packages.filter(({ manifest }) => {
			if (options.filter.indexOf(':') !== -1) {
				const [key, val] = options.filter.split(':');
				return manifest[key] === JSON.parse(val);
			}
			return manifest.name.split('/').slice(-1)[0] === options.filter;
		})
		: packages;
};

module.exports = {
	filterOption,
	applyFilter
};
