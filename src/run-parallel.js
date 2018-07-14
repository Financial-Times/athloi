const logger = require('./logger');
const Stopwatch = require('./stopwatch');

const timer = new Stopwatch();

module.exports = async (tasks = []) => {
	logger.message(`Running ${tasks.length} tasks in parallel`);

	timer.start();
	await Promise.all(tasks.map(Reflect.apply));
	timer.stop();

	logger.message(`${tasks.length} tasks complete, took ${timer.duration}s`);
};
