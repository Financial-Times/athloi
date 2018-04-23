const chalk = require('chalk');
const toSentence = require('array-to-sentence');

module.exports = arr => chalk.grey(
	toSentence(
		arr.map(x => chalk.cyan.italic(x))
	)
);
