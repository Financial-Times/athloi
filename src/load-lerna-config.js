const findUp = require('find-up');

module.exports = async function() {
	const lernaJson = await findUp('lerna.json');
	if(!lernaJson) {
		throw new Error('athloi should be run in a lerna monorepo');
	}
	return require(lernaJson);
}
