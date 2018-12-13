const Semaphore = require('async-sema');
const logger = require('./logger');
const EventedQueue = require('./evented-queue');

module.exports = (tasks = [], concurrency = 1, preserveOrder = false) => {
	const semaphore = new Semaphore(concurrency);
	const queue = new EventedQueue();

	logger.info(`Executing up to ${concurrency} tasks at a time`);

	return Promise.all(
		tasks.map(({ pkg, apply }) => {
			queue.add(pkg.name);

			return semaphore
				.acquire()
				.then(() => {
					// wait for any dependencies still in the queue to finish
					return preserveOrder ? queue.waitFor(pkg.allDependencies) : null;
				})
				.then(() => {
					return apply();
				})
				.then(() => {
					queue.delete(pkg.name);
					return semaphore.release();
				});
		})
	);
};
