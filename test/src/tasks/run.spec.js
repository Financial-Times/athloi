const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/run');

const createPackage = (name, options = {}) => (
	{
		name,
		location: `/Path/to/${name}`,
		...options
	}
);

describe('src/tasks/run', () => {
	const packages = [
		createPackage('foo', { manifest: { scripts: { test: '' } } }),
		createPackage('bar', { manifest: { scripts: { test: '' } } }),
		createPackage('baz', { manifest: {} }),
	];

	const command = 'test';

	let result;

	beforeEach(() => {
		result = subject(packages, command);
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

	it('queues a task for each package with the script', () => {
		expect(result.length).toEqual(2);
	});

	it('provides the correct arguments to run helper', () => {
		result.forEach((item) => {
			item.apply();

			expect(mockRun).toHaveBeenCalledWith('npm', ['run', command], item.pkg.location);
		});
	});
});
