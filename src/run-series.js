const logger = require('./logger');
const promiseSeries = require('./promise-series');

module.exports = async (tasks = []) => {
	logger.message(`Running ${tasks.length} tasks in series`);

	const start = Date.now();
	await promiseSeries(tasks);
	const length = Math.round((Date.now() - start) / 1000);

	logger.message(`${tasks.length} tasks complete, took ${length}s`);
};
