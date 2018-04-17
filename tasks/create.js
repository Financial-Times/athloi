const inquirer = require('inquirer');

exports.choice = () => inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'What\'s the package called?',
	},
]);

exports.run = console.log;
