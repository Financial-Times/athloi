const Subject = require('../../src/evented-queue');

describe('src/evented-queue', () => {
	let instance;

	beforeEach(() => {
		instance = new Subject();
	});

	describe('#add', () => {
		it('adds the given item to the queue', () => {
			instance.add('foo');
			expect(instance.waiting.size).toEqual(1);
		});

		it('emits an event when items are added to the queue', () => {
			return new Promise(resolve => {
				instance.on('add', () => {
					resolve();
				});

				instance.add('foo');
			});
		});
	});

	describe('#delete', () => {
		it('removes the given item to the queue', () => {
			instance.add('foo');
			expect(instance.waiting.size).toEqual(1);

			instance.delete('foo');
			expect(instance.waiting.size).toEqual(0);
		});

		it('emits an event when items are removed from the queue', () => {
			return new Promise(resolve => {
				instance.add('foo');

				instance.on('delete', () => {
					resolve();
				});

				instance.delete('foo');
			});
		});
	});

	describe('#waitBehind', () => {
		it('resolves when the queue no longer contains any of the given items', () => {
			return new Promise(resolve => {
				instance.add('foo').add('bar').add('baz');

				instance.waitBehind(['foo', 'bar', 'baz']).then(() => {
					expect(instance.waiting.size).toEqual(0);
					resolve();
				});

				instance.delete('foo').delete('bar').delete('baz');
			});
		});
	});
});
