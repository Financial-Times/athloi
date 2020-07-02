const fetch = require('node-fetch');

const fetchJSON = async url => {
	const response = await fetch(url);

	if (response.ok) {
		return response.json();
	}

	if (response.status === 404) {
		return null;
	}

	throw new Error(`The request to "${url}" returned a ${response.status}`);
};

module.exports = async (packages = []) => {
	const publishable = packages.filter(pkg => pkg.private === false);
	const requests = publishable.map(pkg =>
		fetchJSON(`https://registry.npmjs.org/${pkg.name}`),
	);
	const results = await Promise.all(requests);

	return results.filter(Boolean).reduce((map, result) => {
		return map.set(result.name, result['dist-tags'].latest);
	}, new Map());
};
