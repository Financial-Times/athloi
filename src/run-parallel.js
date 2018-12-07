const Semaphore = require('async-sema');
const logger = require('./logger');
const EventQueue = require('./event-queue');

module.exports = (tasks = [], concurrency = 1) => {
	const semaphore = new Semaphore(concurrency);
	const queue = new EventQueue();

	logger.info(`Executing up to ${concurrency} tasks at a time`);

	return Promise.all(
		tasks.map(({ pkg, apply }) => {
			return semaphore
				.acquire()
				.then(() => {
					// Queue the package now to maintain running order...
					queue.add(pkg.name);
					// ...but wait for any dependencies in the queue to finish
					return queue.done(pkg.allDependencies);
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
