const { Sema } = require('async-sema');
const logger = require('./logger');
const EventedQueue = require('./evented-queue');

module.exports = (tasks = [], concurrency = 1, preserveOrder = false) => {
	const semaphore = new Sema(concurrency);
	const queue = new EventedQueue();

	logger.debug(`Running ${tasks.length} tasks up to ${concurrency} tasks at a time`);

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
