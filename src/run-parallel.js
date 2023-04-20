const { Sema } = require('async-sema');
const EventedQueue = require('./evented-queue');

module.exports = (tasks = [], concurrency = 1, preserveOrder = false) => {
	console.log('@@@@@@@@@ RUN PARALLEL @@@@@@@@@@');
	const semaphore = new Sema(concurrency);
	console.log('@@@@@@@@@ semaphore @@@@@@@@@@');
	console.log(semaphore);
	const queue = new EventedQueue();
	console.log('@@@@@@@@@ queue @@@@@@@@@@');
	console.log(queue);

	return Promise.all(
		tasks.map(async ({ pkg, apply }) => {
			console.log(`@@@@@@@@@@@@@@@ START ${pkg.name} @@@@@@@@@@@@@@@@@@`);
			queue.add(pkg.name);

			console.log('@@@@@@@@@@ before acquire @@@@@@@@@@');
			await semaphore.acquire();
			console.log('@@@@@@@@@@ after acquire @@@@@@@@@@');

			// wait for any dependencies still in the queue to finish
			if (preserveOrder) {
				console.log(
					'@@@@@@@@@@@@@@@@@@ waiting for dependency @@@@@@@@@@@@@@@@@',
				);
				console.log(pkg.allDependencies);
				await queue.waitBehind(pkg.allDependencies);
			}

			console.log('@@@@@@@@@@ before apply @@@@@@@@@@');
			await apply();
			console.log('@@@@@@@@@@ after apply @@@@@@@@@@');

			queue.delete(pkg.name);

			semaphore.release();
			console.log(`@@@@@@@@@@@@@@@ END ${pkg.name} @@@@@@@@@@@@@@@@@@`);
		}),
	);
};
