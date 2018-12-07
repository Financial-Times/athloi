const Subject = require('../../src/event-queue');

describe('src/event-queue', () => {
	let instance;

	beforeEach(() => {
		instance = new Subject();
	});

	describe('#add', () => {
		it('adds the given item to the queue', () => {
			instance.add('foo');
			expect(instance.queue.size).toEqual(1);
		});

		it('emits an event when items are added to the queue', (done) => {
			instance.on('add', () => {
				done();
			});

			instance.add('foo');
		});
	});

	describe('#delete', () => {
		it('removes the given item to the queue', () => {
			instance.add('foo');
			expect(instance.queue.size).toEqual(1);

			instance.delete('foo');
			expect(instance.queue.size).toEqual(0);
		});

		it('emits an event when items are removed from the queue', (done) => {
			instance.add('foo');

			instance.on('delete', (item) => {
				done();
			});

			instance.delete('foo');
		});
	});

	describe('#waitFor', () => {
		it('resolves when the queue no longer contains any of the given items', (done) => {
			instance.add('foo');
			instance.add('bar');
			instance.add('baz');

			instance.waitFor(['foo', 'bar', 'baz']).then(() => {
				expect(instance.queue.size).toEqual(0);
				done();
			});

			instance.delete('foo');
			instance.delete('bar');
			instance.delete('baz');
		});
	});
});
