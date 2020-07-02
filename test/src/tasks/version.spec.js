const mockGet = jest.fn();

jest.mock('../../../src/get-latest-versions', () => mockGet);

const { task: subject } = require('../../../src/tasks/version');
const createPackage = require('../../helpers/create-package');

describe('src/tasks/version', () => {
	const packages = [
		createPackage('foo'),
		createPackage('bar'),
		createPackage('baz'),
	];

	const tag = 'v1.1.0-beta.1';

	let result;

	beforeEach(async () => {
		result = await subject(packages, tag);
	});

	afterEach(() => {
		mockGet.mockReset();
	});

	it('it returns an array of tasks', () => {
		expect(result).toBeInstanceOf(Array);

		result.forEach(item => {
			expect(item.pkg).toBeDefined();
			expect(item.apply).toEqual(expect.any(Function));
		});
	});

	it('queues a task for every package', () => {
		expect(result.length).toEqual(3);
	});

	it('validates the given tag', async () => {
		await expect(subject(packages, '0-foo')).rejects.toThrow(
			'The given tag "0-foo" is not a valid version number',
		);
	});

	it('fetches the latest version for all packages', () => {
		expect(mockGet).toHaveBeenCalledWith([]);
	});
});
