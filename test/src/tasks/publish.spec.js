const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/publish');
const createPackage = require('../../helpers/create-package');

describe('src/tasks/publish', () => {
	const packages = [
		createPackage('foo'),
		createPackage('bar'),
		createPackage('baz', { private: true }),
	];

	const args = ['--access', 'public'];

	let result;

	beforeEach(() => {
		result = subject(packages, args);
	});

	afterEach(() => {
		mockRun.mockReset();
	});

	it('it returns an array of tasks', () => {
		expect(result).toBeInstanceOf(Array);

		result.forEach((item) => {
			expect(item.pkg).toBeDefined();
			expect(item.apply).toEqual(expect.any(Function));
		});
	});

	it('queues a task for every non-private package', () => {
		expect(result.length).toEqual(2);
	});

	it('provides the correct arguments to run helper', () => {
		result.forEach((item) => {
			item.apply();

			expect(mockRun).toHaveBeenCalledWith('npm', ['publish'].concat(args), item.pkg.location);
		});
	});
});
