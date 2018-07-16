const path = require('path');
const spawn = require('./spawn');
const logger = require('./logger');

module.exports = async (cmd, args = [], location) => {
	const relPath = path.relative(process.cwd(), location);

	logger.info(`Running task in ${relPath}`);

	try {
		await spawn(cmd, args, { cwd: location });
		logger.success('Task succeeded\n');
	} catch (error) {
		logger.error(error.message);
		return Promise.reject(error);
	}
};
