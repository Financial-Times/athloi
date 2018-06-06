const inquirer = require('inquirer');
const chalk = require('chalk');

const prefix = chalk.green.bold.italic('  ?');

const runPrompt = (choice, argv = {}) => [].concat(choice).reduce(
	async (argvPromise, spec) => {
		const argv = await argvPromise;
		console.log(argv);

		const answer = spec.name in argv
			? {[spec.name]: argv[spec.name]} // skip prompt if it's already been given (e.g. by CLI args)
			: await inquirer.prompt([
				Object.assign({prefix}, spec)
			]);

		return Object.assign(argv, answer);
	},
	Promise.resolve(argv)
);

module.exports = runPrompt;
