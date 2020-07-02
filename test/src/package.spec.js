jest.mock('fs');

const fs = require('fs');
const Subject = require('../../src/package');

const fixture = Object.freeze({
	name: 'my-package',
	version: '0.0.0',
	dependencies: {
		lodash: '^3.0.0',
		hyperons: '^0.5.0',
	},
	devDependencies: {
		jest: '^16.0.0',
		prettier: '^12.0.0',
	},
});

const factory = json => {
	return new Subject(json, '/root/path/to/package');
};

describe('src/package', () => {
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

	describe('get #private', () => {
		it('returns a boolean', () => {
			const instance = factory(fixture);
			expect(instance.private).toBe(false);
		});
	});

	describe('get #manifestLocation', () => {
		it('gets the manifest name', () => {
			const instance = factory(fixture);
			expect(instance.manifestLocation).toBe(
				'/root/path/to/package/package.json',
			);
		});
	});

	describe('get #nodeModulesLocation', () => {
		it('gets the manifest name', () => {
			const instance = factory(fixture);
			expect(instance.nodeModulesLocation).toEqual(
				'/root/path/to/package/node_modules',
			);
		});
	});

	describe('get #allDependencies', () => {
		it('returns a list of all dependencies', () => {
			const instance = factory(fixture);
			expect(instance.allDependencies).toBeInstanceOf(Array);
			expect(instance.allDependencies.length).toEqual(4);
		});
	});

	describe('#writeManifest', () => {
		beforeEach(() => {
			// The final arg is a callback that needs calling!
			fs.writeFile.mockImplementation((...args) =>
				args[args.length - 1](),
			);
		});

		it('writes the new manifest', async () => {
			const instance = factory(fixture);
			await instance.writeManifest({ ...fixture, version: '1.0.0' });

			expect(fs.writeFile).toHaveBeenCalledWith(
				'/root/path/to/package/package.json',
				JSON.stringify({ ...fixture, version: '1.0.0' }, null, 2),
				expect.any(Function),
			);
		});

		it('updates the manifest property', async () => {
			const instance = factory(fixture);
			await instance.writeManifest({ ...fixture, version: '1.0.0' });

			expect(instance.manifest.version).toEqual('1.0.0');
		});
	});
});
