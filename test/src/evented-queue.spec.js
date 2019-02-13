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
			expect(instance.waiting.size).toEqual(1);

			instance.delete('foo');
			expect(instance.waiting.size).toEqual(0);
		});

		it('emits an event when items are removed from the queue', (done) => {
			instance.add('foo');

			instance.on('delete', () => {
				done();
			});

			instance.delete('foo');
		});
	});

	describe('#waitBehind', () => {
		it('resolves when the queue no longer contains any of the given items', (done) => {
			instance
				.add('foo')
				.add('bar')
				.add('baz');

			instance.waitBehind(['foo', 'bar', 'baz']).then(() => {
				expect(instance.waiting.size).toEqual(0);
				done();
			});

			instance
				.delete('foo')
				.delete('bar')
				.delete('baz');
		});
	});
});
