const path = require('path');
const chalkHash = require('@quarterto/chalk-hash');
const logger = require('./logger');
const chalk = require('chalk');
const spawn = require('./spawn');

module.exports = async function runPackage(command, pkgDir) {
	const pkgName = path.basename(pkgDir);
	logger.start(chalkHash(command) + ' ' + chalkHash(pkgName));

	try {
		await spawn('npm', ['run', command], {cwd: pkgDir});
		logger.success(chalkHash(command) + ' ' + chalkHash(pkgName) + ' succeeded');
	} catch(e) {
		logger.failure(e.message);
		throw e;
	} finally {
		console.log('\n'); // clear a couple of lines
	}
};
