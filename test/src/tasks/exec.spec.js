const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/exec');
const createPackage = require('../../helpers/create-package');

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

	it('it returns an array of tasks', () => {
		expect(result).toBeInstanceOf(Array);

		result.forEach((item) => {
			expect(item.pkg).toBeDefined();
			expect(item.apply).toEqual(expect.any(Function));
		});
	});

	it('queues a task for every package', () => {
		expect(result.length).toEqual(3);
	});

	it('provides the correct arguments to run helper', () => {
		result.forEach((item) => {
			item.apply();

			expect(mockRun).toHaveBeenCalledWith(command, args, item.pkg.location);
		});
	});
});
