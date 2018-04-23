#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const minimist = require('minimist');
const PrettyError = require('pretty-error');
const tasks = require('./tasks');
const getPackages = require('./get-packages');
const protip = require('./protip');

const pe = new PrettyError();

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
	const nonexistentTask = !(task in tasks);

	if(!noTask && nonexistentTask) {
		console.log(`
there's no ${chalk.cyan(task)} task. available tasks are:
${Object.keys(tasks).map(t => ` ・ ${chalk.blue(t)}`).join('\n')}

run ${chalk.magenta('athloi')} again with one of these tasks (e.g. ${chalk.grey('athloi start')}),
or without a task to get the interactive prompt:
		`);
	}

	let didAPrompt = false;

	if(noTask || nonexistentTask) {
		task = await chooseTask();
		didAPrompt = true;
	}

	const missingArgs = tasks[task].requiredArgs && tasks[task].requiredArgs.some(
		arg => !argv.hasOwnProperty(arg)
	);

	if(missingArgs && tasks[task].choice) {
		Object.assign(
			argv,
			await tasks[task].choice()
		);
		didAPrompt = true;
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
		console.error(pe.render(e));
		process.exit(1);
	}
);
