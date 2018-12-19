const EventEmitter = require('events');

class EventedQueue extends EventEmitter {
	constructor() {
		super();
		this.queue = new Set();
	}

	add(item) {
		this.queue.add(item);
		this.emit('add', item);
		return this;
	}

	delete(item) {
		this.queue.delete(item);
		this.emit('delete', item);
		return this;
	}

	waitFor(items = []) {
		return new Promise((resolve) => {
			const callback = () => {
				const itemsRunning = items.some((item) => this.queue.has(item));

				if (!itemsRunning) {
					this.removeListener('delete', callback);
					resolve();
				}
			};

			this.on('delete', callback);

			callback();
		});
	}
}

module.exports = EventedQueue;
