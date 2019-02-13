const Semaphore = require('async-sema');
const logger = require('./logger');
const EventedQueue = require('./evented-queue');

module.exports = (tasks = [], concurrency = 1, preserveOrder = false) => {
	const semaphore = new Semaphore(concurrency);
	const queue = new EventedQueue();

	logger.info(`Executing up to ${concurrency} tasks at a time`);

	return Promise.all(
		tasks.map(async ({ pkg, apply }) => {
			queue.add(pkg.name);

			await semaphore.acquire();

			// wait for any dependencies still in the queue to finish
			if (preserveOrder) {
				await queue.waitBehind(pkg.allDependencies);
			}

			await apply();

			queue.delete(pkg.name);

			semaphore.release();
		})
	);
};
