const EventEmitter = require('events');

class EventQueue extends EventEmitter {
	constructor() {
		super();
		this.queue = new Set();
	}

	add(item) {
		this.queue.add(item);
		this.emit('queue:add', item);
	}

	delete(item) {
		this.queue.delete(item);
		this.emit('queue:delete', item);
	}

	// Resolves when the queue contains none of the given items
	done(items = []) {
		return new Promise((resolve) => {
			const callback = () => {
				const noItemsRunning = items.every((item) => !this.queue.has(item));

				if (noItemsRunning) {
					this.off('queue:delete', callback);
					resolve();
				}
			};

			this.on('queue:delete', callback);
			callback();
		});
	}
}

module.exports = EventQueue;
