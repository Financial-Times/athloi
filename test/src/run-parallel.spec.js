const subject = require('../../src/run-parallel');

const wait = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

const noop = () => {};

function createTask(name, onStart, onEnd, time = 10, allDependencies = []) {
	return {
		apply: () => {
			onStart();
			return wait(time).then(onEnd);
		},
		pkg: {
			name,
			allDependencies
		}
	};
}

describe('src/run-parallel', () => {
	it('executes each task', async () => {
		const complete = [];

		const tasks = [
			createTask('a', noop, () => complete.push('a')),
			createTask('b', noop, () => complete.push('b')),
			createTask('c', noop, () => complete.push('c'))
		];

		await subject(tasks);

		expect(complete.length).toEqual(3);
	});

	describe('with preserve order option', () => {
		it('waits for dependent tasks to finish', async () => {
			const complete = []

			const tasks = [
				createTask(
					'a',
					() => expect(complete.length).toEqual(0),
					() => complete.push('a'),
					100
				),
				createTask(
					'b',
					() => expect(complete.length).toEqual(0),
					() => complete.push('b'),
					10
				),
				createTask(
					'c',
					() => expect(complete).toEqual(expect.arrayContaining(['a', 'b'])),
					() => complete.push('c'),
					10,
					['a', 'b']
				)
			];

			await subject(tasks, 10, true);
		});
	});

	describe('without preserve order option', () => {
		it('waits for dependent tasks to finish', async () => {
			const complete = []

			const tasks = [
				createTask(
					'a',
					() => expect(complete.length).toEqual(0),
					() => complete.push('a'),
					100
				),
				createTask(
					'b',
					() => expect(complete.length).toEqual(0),
					() => complete.push('b'),
					10
				),
				createTask(
					'c',
					() => expect(complete.length).toEqual(0),
					() => complete.push('c'),
					10,
					['a', 'b']
				)
			];

			await subject(tasks, 10, false);
		});
	});
});
