const spawn = require('./spawn');
const logger = require('./logger');

module.exports = async (cmd, args = [], packagePath) => {
	const shortPath = packagePath.replace(process.cwd(), '');

	logger.info(`Running task in ${shortPath}`);

	try {
		await spawn(cmd, args, { cwd: packagePath });
		logger.success(`Task succeeded\n`);
	} catch (error) {
		logger.error(error.message);
		return Promise.reject(error);
	}
};
