const subject = require('../../src/update-versions');

const fixture = Object.freeze({
	version: '1.0.0',
	dependencies: {
		foo: 'file:../foo',
		bar: '^1.2.3',
	},
	devDependencies: {
		baz: 'link:../baz',
	},
	peerDependencies: {
		qux: 'file:../qux',
	},
});

describe('src/update-versions', () => {
	it('returns a new object', () => {
		const targets = new Set(['foo', 'bar', 'baz', 'qux']);
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result).not.toEqual(fixture);
	});

	it('updates the version number', () => {
		const targets = new Set(['foo', 'bar', 'baz', 'qux']);
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.version).toEqual('1.1.0');
	});

	it('updates the version numbers of targeted local dependencies', () => {
		const targets = new Set(['foo', 'bar', 'baz', 'qux']);
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.dependencies.foo).toEqual('^1.1.0');
		expect(result.peerDependencies.qux).toEqual('^1.1.0');
	});

	it('uses a fallback version for other local dependencies', () => {
		const targets = new Set(['foo', 'baz']);
		const fallbacks = new Map().set('qux', '1.0.2');
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.peerDependencies.qux).toEqual('^1.0.2');
	});

	it('does not update development dependency version numbers', () => {
		const targets = new Set(['foo', 'bar', 'baz', 'qux']);
		const fallbacks = new Map();
		const result = subject(fixture, targets, '1.1.0', fallbacks);

		expect(result.devDependencies.baz).toEqual('link:../baz');
	});

	it('throws if no fallback version is found for other local dependencies', () => {
		const targets = new Set(['baz']);
		const fallbacks = new Map().set('foo', '1.0.1');
		const result = () => subject(fixture, targets, '1.1.0', fallbacks);

		expect(result).toThrowError(
			'No suitable version found for qux package',
		);
	});
});
