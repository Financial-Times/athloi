const findUp = require('find-up');
const glob = require('glob-promise');

module.exports = async function() {
	const lernaJson = await findUp('lerna.json');
	if(!lernaJson) {
		throw new Error('Athloi should be run in a Lerna monorepo');
	}

	const {packages} = require(lernaJson);
	return glob(`{${packages.join(',')}}`);
};
