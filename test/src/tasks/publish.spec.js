const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/publish');

const createPackage = (name, options = {}) => (
	{
		name,
		location: `/Path/to/${name}`,
		...options
	}
);

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

	it('it returns an array of functions', () => {
		expect(result).toBeInstanceOf(Array);

		result.forEach((item) => {
			expect(item).toBeInstanceOf(Function);
		});
	});

	it('queues a task for every non-private package', () => {
		expect(result.length).toEqual(2);
	});

	it('provides the correct arguments to run helper', () => {
		result.forEach((item, i) => {
			const pkg = packages[i];

			item();

			expect(mockRun).toHaveBeenCalledWith('npm', ['publish'].concat(args), pkg.location);
		});
	});
});
