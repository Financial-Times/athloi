const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/exec');

const createPackage = (name) => (
	{
		name,
		location: `/Path/to/${name}`
	}
);

describe('src/tasks/exec', () => {
	const packages = [
		createPackage('foo'),
		createPackage('bar'),
		createPackage('baz'),
	];

	const command = 'test-command';

	const args = ['--flag', '--named', 'value'];

	let result;

	beforeEach(() => {
		result = subject(packages, command, args);
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
		result.forEach((item, i) => {
			const pkg = packages[i];

			item();

			expect(mockRun).toHaveBeenCalledWith(command, args, pkg.location);
		});
	});
});
