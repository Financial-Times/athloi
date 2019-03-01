const path = require('path');
const spawn = require('./spawn');
const logger = require('./logger');

module.exports = async (cmd, args = [], location) => {
	const relPath = path.relative(process.cwd(), location);

	logger.debug(`Running task in ${relPath}`);

	// TODO: remove try/catch and let error bubble
	try {
		await spawn(cmd, args, { cwd: location });
		logger.success(`Task succeeded in ${relPath}`);
	} catch (error) {
		logger.error(error.message);
		return Promise.reject(error);
	}
};
