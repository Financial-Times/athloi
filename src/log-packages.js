const logger = require('./logger');
const chalk = require('chalk');
const toSentence = require('array-to-sentence');
const chalkHash = require('@quarterto/chalk-hash');
const path = require('path');

module.exports = (script, packages, parallel) => {
	console.log();

	if(packages.length === 0) {
		logger.info(`no packages with the ${chalk.blue(script)} script`);
		return false;
	}

	const packageNames = toSentence(packages.map(name => chalk.cyan.italic(path.basename(name))));

	logger.start(`running ${chalkHash(script)} ${parallel ? 'in parallel' : 'serially'}`);
	logger.packages(chalk.grey(`in ${packageNames}`));

	console.log();

	return true;
};
