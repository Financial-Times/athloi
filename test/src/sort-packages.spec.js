const subject = require('../../src/sort-packages');
const createPackage = require('../helpers/create-package');

const fixture = [
	createPackage('foo', {
		dependencies: {
			qux: '0.0.0',
		},
	}),
	createPackage('bar', {
		dependencies: {
			baz: '0.0.0',
		},
	}),
	createPackage('baz', {
		dependencies: {
			foo: '0.0.0',
			qux: '0.0.0',
		},
	}),
	createPackage('qux', {
		dependencies: {},
	}),
];

describe('src/sort-packages', () => {
	it('returns a new array', () => {
		const result = subject(null, fixture);
		expect(result).not.toEqual(fixture);
	});

	it('sorts packages topologically', () => {
		const result = subject(null, fixture);

		['qux', 'foo', 'baz', 'bar'].forEach((name, i) => {
			expect(result[i].name).toEqual(name);
		});
	});

	it('can reverse the sort order', () => {
		const result = subject(true, fixture);

		['bar', 'baz', 'foo', 'qux'].forEach((name, i) => {
			expect(result[i].name).toEqual(name);
		});
	});
});
