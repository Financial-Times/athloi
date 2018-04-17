const findUp = require('find-up');
const glob = require('glob-promise');

module.exports = async function() {
	const lernaJson = await findUp('lerna.json');
	if(!lernaJson) {
		throw new Error('athloi should be run in a lerna monorepo');
	}

	const {packages} = require(lernaJson);
	return glob(`{${packages.join(',')}}`);
};
