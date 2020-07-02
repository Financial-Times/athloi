const { Sema } = require('async-sema');
const EventedQueue = require('./evented-queue');

module.exports = (tasks = [], concurrency = 1, preserveOrder = false) => {
	const semaphore = new Sema(concurrency);
	const queue = new EventedQueue();

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
		}),
	);
};
