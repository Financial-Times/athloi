const spawn = require('./spawn');
const logger = require('./logger');

module.exports = async (cmd, args = [], location) => {
	const shortPath = location.replace(process.cwd(), '');

	logger.info(`Running task in ${shortPath}`);

	try {
		await spawn(cmd, args, { cwd: location });
		logger.success(`Task succeeded\n`);
	} catch (error) {
		logger.error(error.message);
		return Promise.reject(error);
	}
};
