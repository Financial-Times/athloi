const subject = require('../../src/sort-packages');

const fixture = Object.freeze([
	{
		name: 'foo',
		manifest: {
			dependencies: {
				qux: '0.0.0'
			}
		}
	},
	{
		name: 'bar',
		manifest: {
			dependencies: {
				baz: '0.0.0'
			}
		}
	},
	{
		name: 'baz',
		manifest: {
			dependencies: {
				foo: '0.0.0',
				qux: '0.0.0'
			}
		},
	},
	{
		name: 'qux',
		manifest: {
			dependencies: {
			}
		}
	}
]);

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
