const logger = require('./logger');
const Sema = require('async-sema');

module.exports = (tasks = [], concurrency = 1) => {
	const sema = new Sema(concurrency);

	logger.info(`Executing up to ${concurrency} tasks at a time`);

	return Promise.all(
		tasks.map((task) => {
			return sema.acquire().then(task).then(() => sema.release());
		})
	);
};
