const inquirer = require('inquirer');

exports.label = 'Create a new package';
exports.choice = () => inquirer.prompt([
	{
		type: 'input',
		name: 'name',
		message: 'What\'s the package called?',
	},
]);

exports.requiredArgs = ['name'];

exports.run = console.log;
