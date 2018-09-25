const subject = require('../../src/update-versions');

const fixture = Object.freeze({
	version: '0.0.0',
	dependencies: {
		foo: 'file:../foo',
		bar: '^1.2.3',
	},
	devDependencies: {
		baz: 'file:../baz'
	}
});

describe('src/update-versions', () => {
	it('returns a new object', () => {
		const result = subject(fixture);
		expect(result).not.toEqual(fixture);
	});

	it('updates the version number', () => {
		const result = subject(fixture, '1.0.0');
		expect(result.version).toEqual('1.0.0');
	});

	it('updates the version numbers of any local dependencies', () => {
		const result = subject(fixture, '1.0.0', [ 'foo', 'baz' ]);

		expect(result.dependencies.foo).toEqual('^1.0.0');
		expect(result.devDependencies.baz).toEqual('^1.0.0');
	});

	it('does not update the version numbers of any non-local dependencies', () => {
		const result = subject(fixture, '1.0.0', [ 'bar' ]);

		expect(result.dependencies.bar).toEqual('^1.2.3');
	});
});
