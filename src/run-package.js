const path = require('path');
const spawn = require('./spawn');
const logger = require('./logger');

module.exports = async (cmd, args = [], location) => {
	const relPath = path.relative(process.cwd(), location);

	logger.debug(`Running task in ${relPath}`);
	const logs = await spawn(cmd, args, { cwd: location });

	logger.info(`Output from ${relPath}:`);
	logs.forEach((log) => logger.debug(log));
	logger.success(`Task succeeded in ${relPath}`);
};
