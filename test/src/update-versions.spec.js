const subject = require('../../src/update-versions');

const fixture = Object.freeze({
	version: '1.0.0',
	dependencies: {
		foo: 'file:../foo',
		bar: '^1.2.3',
	},
	devDependencies: {
		baz: 'link:../baz'
	}
});

describe('src/update-versions', () => {
	it('returns a new object', () => {
		const targets = new Set();
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result).not.toEqual(fixture);
	});

	it('updates the version number', () => {
		const targets = new Set();
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.version).toEqual('1.1.0');
	});

	it('updates the version numbers of targeted local dependencies', () => {
		const targets = new Set([ 'foo', 'baz' ]);
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.dependencies.foo).toEqual('^1.1.0');
		expect(result.devDependencies.baz).toEqual('^1.1.0');
	});

	it('uses fallback version for non-targeted local dependencies', () => {
		const targets = new Set([ 'baz' ]);
		const fallbacks = new Map([[ 'foo', '1.0.1' ]]);
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.dependencies.foo).toEqual('^1.0.1');
		expect(result.devDependencies.baz).toEqual('^1.1.0');
	});

	it('does not update the version numbers of any non-local dependencies', () => {
		const targets = new Set([ 'bar' ]);
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.0.0', fallbacks);

		expect(result.dependencies.bar).toEqual('^1.2.3');
	});
});
