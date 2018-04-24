const findUp = require('find-up');
const inquirer = require('inquirer');
const prefix = require('./inquirer-prefix');

module.exports = async function(tasks) {
	const athloiJs = await findUp('athloi.js');

	if(athloiJs) {
		return require(athloiJs)({
			addPrompt: (choose, extraPrompt) => (
				(...args) => (
					choose || (async () => ({}))
				)(...args).then(
					choice => (
						extraPrompt(...args).then(
							extraChoice => Object.assign(choice, extraChoice)
						)
					)
				)
			),

			prompt: prompts => (
				inquirer.prompt(
					prompts.map(
						p => Object.assign({prefix}, p)
					)
				)
			),

			tasks,
		});
	}

	return {};
}
