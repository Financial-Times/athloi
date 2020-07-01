const mockGlob = jest.fn();
jest.mock('glob', () => mockGlob);

const subject = require('../../src/get-packages');

describe('src/get-packages', () => {
	afterEach(() => {
		mockGlob.mockReset();
	});

	it('munges multiple patterns', () => {
		subject(['components/*', 'packages/*']);

		expect(mockGlob).toHaveBeenCalledWith(
			'{components/*,packages/*}',
			expect.any(Object),
			expect.any(Function),
		);
	});

	it('does not munge a single pattern', () => {
		subject(['components/*']);

		expect(mockGlob).toHaveBeenCalledWith(
			'components/*',
			expect.any(Object),
			expect.any(Function),
		);
	});
});
