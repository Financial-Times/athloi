const path = require('path');
const spawn = require('./spawn');
const logger = require('./logger');

module.exports = async (cmd, args = [], location) => {
	const relPath = path.relative(process.cwd(), location);

	try {
		const logs = await spawn(cmd, args, { cwd: location });

		logger.success(`Task succeeded in ${relPath}`);

		logs.forEach((log) => logger.debug(log));

		logger.debug('\n');
	} catch (error) {
		logger.error(`Task failed in ${relPath}`);

		if (Array.isArray(error.logs)) {
			error.logs.forEach((log) => logger.debug(log));
		}

		logger.debug('\n');

		return Promise.reject(error);
	}
};
