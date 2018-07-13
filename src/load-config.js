const findUp = require('find-up');

module.exports = async () => {
	const config = await findUp('monorepo.json');

	if (!config) {
		throw Error('Could not find monorepo.json');
	}

	return require(config);
};
