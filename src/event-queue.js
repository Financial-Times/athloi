const EventEmitter = require('events');

class EventQueue extends EventEmitter {
	constructor() {
		super();
		this.queue = new Set();
	}

	add(item) {
		this.queue.add(item);
		this.emit('add', item);
	}

	delete(item) {
		this.queue.delete(item);
		this.emit('delete', item);
	}

	waitFor(items = []) {
		return new Promise((resolve) => {
			const callback = (item) => {
				const itemsRunning = items.some((item) => this.queue.has(item));

				if (!itemsRunning) {
					this.off('delete', callback);
					resolve();
				}
			};

			this.on('delete', callback);

			callback(null);
		});
	}
}

module.exports = EventQueue;
