#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const minimist = require('minimist');
const builtinTasks = require('./tasks');
const loadLernaJson = require('./load-lerna-config');
const loadCustomTasks = require('./load-custom-tasks');
const getPackages = require('./get-packages');
const protip = require('./protip');
const sentence = require('./sentence');
const logger = require('./logger');
const {argvZero, argvSeparated} = require('./argv-zero');
const runPrompt = require('./prompt');

async function chooseTask(tasks) {
	console.log();

	const {task} = await runPrompt([{
		type: 'list',
		name: 'task',
		message: 'What do you want to do?',
		choices: Object.keys(tasks).map(task => ({
			value: task, short: task, name: tasks[task].label
		})),
	}]);

	return task;
}

async function main(argv) {
	const extraTasks = await loadCustomTasks(builtinTasks);
	const allTasks = Object.assign({}, builtinTasks, extraTasks);

	const noTask = argv._.length === 0;
	let task = argv._.shift();

	const nonexistentTask = !noTask && !(task in allTasks);
	const taskNames = sentence(Object.keys(allTasks));

	let didAPrompt = false;

	if(noTask || nonexistentTask) {
		const nonexistentMessage = `there's no ${chalk.cyan(task)} task`;

		if(process.stdin.isTTY) {
			if(nonexistentTask) {
				logger.failure(nonexistentMessage);
				logger.message(`available tasks are ${taskNames}\n`);
				logger.message(`run ${argvZero} again with one of these tasks (e.g. ${argvSeparated} ${chalk.cyan.italic('start')}), or without a task to get the interactive prompt:`);
				console.log();
			}

			task = await chooseTask(allTasks);
			didAPrompt = true;
		} else {
			throw new Error(`${nonexistentTask ? nonexistentMessage : 'no task specified'}. available tasks are ${taskNames}`);
		}
	}

	argv.lernaJson = await loadLernaJson();
	argv.packages = await getPackages(argv.lernaJson.packages);
	argv.logger = logger;

	const missingArgs = (allTasks[task].requiredArgs || []).filter(
		arg => !argv.hasOwnProperty(arg)
	);

	if(missingArgs.length > 0) {
		if(process.stdin.isTTY) {
			if(allTasks[task].choice) {
				const choice = await allTasks[task].choice(argv);

				const chosenArgv = await runPrompt(
					choice,
					argv
				);

				Object.assign(
					argv,
					chosenArgv
				);

				didAPrompt = true;
			}
		} else {
			const required = sentence(allTasks[task].requiredArgs);
			const missing = missingArgs.length === allTasks[task].requiredArgs.length
				? missingArgs.length === 1
					? 'it'
					: 'all of them'
				: sentence(missingArgs);

			const was = missingArgs.length === 1 ? 'was' : 'were';
			const args = allTasks[task].requiredArgs.length === 1 ? 'argument' : 'arguments';

			throw new Error(`${chalk.blue(task)} needs ${args} ${required} but ${missing} ${was} missing`);
		}
	}

	if(didAPrompt) {
		await protip(task, argv);
	}

	return allTasks[task].run(argv);
}

main(
	minimist(process.argv.slice(2))
).catch(
	e => {
		const errorTag = chalk.black.keyword('black').bold.bgRed(' ' + e.constructor.name.toUpperCase() + ' ');
		console.log();
		console.log(`  ${errorTag} ${e.message}`);
		logger.stack(e.stack.split('\n').slice(1).join('\n').trim());
		logger.failure('sorry about that');
		process.exit(1);
	}
);
