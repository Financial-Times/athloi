const filterOption = ['-f --filter [option]', 'Filter packages where a command should run'];
const applyFilter = (options, packages) => {
	let filter;
	let filteredPackages;
	let parsedOptions = options;
	if (Array.isArray(options)) {
		const filterIndex = options.indexOf('--filter') || options.indexOf('-f');
		if (filterIndex !== -1) {
			filter = options[filterIndex + 1];
			parsedOptions = [...options.slice(0, filterIndex), ...options.slice(filterIndex + 2)];
		}
	} else {
		if (options.hasOwnProperty('filter')) {
			filter = options.filter;
		}
	}
	filteredPackages = filter
		? packages.filter(({ manifest }) => {
				if (filter.indexOf(':') !== -1) {
					const [key, val] = filter.split(':');
					return manifest[key] === JSON.parse(val);
				}
				return manifest.name.split('/').slice(-1)[0] === filter;
		  })
		: packages;

	return {
		filteredPackages,
		parsedOptions
	};
};

module.exports = {
	filterOption,
	applyFilter
};
