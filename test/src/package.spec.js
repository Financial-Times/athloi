const path = require('path');
const Subject = require('../../src/package');

const fixture = Object.freeze({
	name: 'my-package',
	version: '0.0.0',
});

describe('src/package', () => {
	const factory = (json) => {
		return new Subject(json, '/root/path/to/package');
	};

	describe('constructor', () => {
		it('stores the given manifest', () => {
			const instance = factory(fixture);
			expect(instance.manifest).toBe(fixture);
		});

		it('stores the given location', () => {
			const instance = factory(fixture);
			expect(instance.location).toBe('/root/path/to/package');
		});
	});

	describe('get #name', () => {
		it('gets the manifest name', () => {
			const instance = factory(fixture);
			expect(instance.name).toBe('my-package');
		});
	});

	describe('get #manifestLocation', () => {
		it('gets the manifest name', () => {
			const instance = factory(fixture);
			expect(instance.manifestLocation).toBe('/root/path/to/package/package.json');
		});
	});

	describe('get #nodeModulesLocation', () => {
		it('gets the manifest name', () => {
			const instance = factory(fixture);
			expect(instance.nodeModulesLocation).toEqual('/root/path/to/package/node_modules');
		});
	});
});
