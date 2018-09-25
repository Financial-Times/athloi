const mockRun = jest.fn();
jest.mock('../../../src/run-package', () => mockRun);

const { task: subject } = require('../../../src/tasks/version');

const createPackage = (name) => (
	{
		name,
		location: `/Path/to/${name}`
	}
);

describe('src/tasks/version', () => {
	const packages = [
		createPackage('foo'),
		createPackage('bar'),
		createPackage('baz'),
	];

	const tag = 'v1.1.0-beta.1';

	let result;

	beforeEach(() => {
		result = subject(packages, tag);
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

	it('validates the given tag', async () => {
		try {
			await subject(packages, '0-foo');
		} catch (error) {
			expect(error.message).toEqual(expect.stringContaining('not a valid version number'));
		}
	});
});
