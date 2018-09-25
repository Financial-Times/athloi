const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/script');

const createPackage = (name) => (
	{
		name,
		location: `/Path/to/${name}`
	}
);

describe('src/tasks/script', () => {
	const packages = [
		createPackage('foo'),
		createPackage('bar'),
		createPackage('baz'),
	];

	const scriptPath = 'path/to/script.js';

	let result;

	beforeEach(() => {
		result = subject(packages, scriptPath);
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

	it('queues a task for every package', () => {
		expect(result.length).toEqual(3);
	});

	it('provides the correct arguments to run helper', () => {
		const resolvedPath = process.cwd() + '/' + scriptPath;

		result.forEach((item, i) => {
			const pkg = packages[i];

			item();

			expect(mockRun).toHaveBeenCalledWith('node', [ resolvedPath ], pkg.location);
		});
	});
});
