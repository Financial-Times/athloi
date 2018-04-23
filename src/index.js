#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const minimist = require('minimist');
const tasks = require('./tasks');
const getPackages = require('./get-packages');
const protip = require('./protip');
const sentence = require('./sentence');
const logger = require('./logger')

async function chooseTask() {
	const {task} = await inquirer.prompt([{
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
	let task = argv._[0];
	const noTask = argv._.length === 0;
	const nonexistentTask = !noTask && !(task in tasks);
	const taskNames = sentence(Object.keys(tasks));

	let didAPrompt = false;

	if(noTask || nonexistentTask) {
		const nonexistentMessage = `there's no ${chalk.cyan(task)} task`;

		if(process.stdin.isTTY) {
			if(nonexistentTask) {
				logger.failure(nonexistentMessage);
				logger.message(`available tasks are ${taskNames}\n`);
				logger.message(`run ${chalk.magenta('athloi')} again with one of these tasks (e.g. ${chalk.grey('athloi start')}), or without a task to get the interactive prompt:`);
				console.log();
			}

			task = await chooseTask();
			didAPrompt = true;
		} else {
			throw new Error(`${nonexistentTask ? nonexistentMessage : 'no task specified'}. available tasks are ${taskNames}`);
		}
	}

	const missingArgs = (tasks[task].requiredArgs || []).filter(
		arg => !argv.hasOwnProperty(arg)
	);

	if(missingArgs.length > 0) {
		if(process.stdin.isTTY) {
			if(tasks[task].choice) {
				Object.assign(
					argv,
					await tasks[task].choice()
				);

				didAPrompt = true;
			}
		} else {
			const required = sentence(tasks[task].requiredArgs);
			const missing = missingArgs.length === tasks[task].requiredArgs.length
				? missingArgs.length === 1
					? 'it'
					: 'all of them'
				: sentence(missingArgs);

			const was = missingArgs.length === 1 ? 'was' : 'were';
			const args = tasks[task].requiredArgs.length === 1 ? 'argument' : 'arguments';

			throw new Error(`${chalk.blue(task)} needs ${args} ${required} but ${missing} ${was} missing`);
		}
	}

	if(didAPrompt) {
		await protip(task, argv);
	}

	argv.packages = await getPackages();

	return tasks[task].run(argv);
}

main(
	minimist(process.argv.slice(2))
).catch(
	e => {
		const errorTag = chalk.black.keyword('black').bold.bgRed(' ' + e.constructor.name.toUpperCase() + ' ');
		console.log();
		console.log(`  ${errorTag} ${e.message}`);
		logger.stack(e.stack.split('\n').slice(1).join('\n').trim());
		process.exit(1);
	}
);
