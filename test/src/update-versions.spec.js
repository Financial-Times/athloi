const subject = require('../../src/update-versions');

const fixture = Object.freeze({
	version: '0.0.0',
	dependencies: {
		foo: '0.0.0',
		bar: '1.2.3',
	},
	devDependencies: {
		baz: '0.0.0'
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

		expect(result.dependencies.foo).not.toEqual('0.0.0');
		expect(result.devDependencies.baz).not.toEqual('0.0.0');
	});

	it('uses a caret range for local dependencies version numbers', () => {
		const result = subject(fixture, '1.0.0', [ 'foo', 'baz' ]);

		expect(result.dependencies.foo).toEqual('^1.0.0');
		expect(result.devDependencies.baz).toEqual('^1.0.0');
	});
});
