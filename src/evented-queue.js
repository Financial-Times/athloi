const EventEmitter = require('events');

class EventedQueue extends EventEmitter {
	constructor () {
		super();
		this.waiting = new Set();
	}

	add (item) {
		this.waiting.add(item);
		this.emit('add', item);
		return this;
	}

	delete (item) {
		this.waiting.delete(item);
		this.emit('delete', item);
		return this;
	}

	waitBehind (items = []) {
		return new Promise((resolve) => {
			const callback = () => {
				const itemsWaiting = items.some((item) => this.waiting.has(item));

				if (!itemsWaiting) {
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
