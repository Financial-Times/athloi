const logger = require('./logger');
const Stopwatch = require('./stopwatch');

const timer = new Stopwatch();

const promiseSeries = (tasks = []) => {
	return tasks.reduce((current, next) => current.then(next), Promise.resolve());
};

module.exports = async (tasks = []) => {
	logger.message(`Running ${tasks.length} tasks in series`);

	timer.start();
	await promiseSeries(tasks);
	timer.stop();

	logger.message(`${tasks.length} tasks complete, took ${timer.duration}s`);
};