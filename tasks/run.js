const runPackagesSerial = require('../run-packages-serial');
const runPackagesParallel = require('../run-packages-parallel');
const inquirer = require('inquirer');

exports.label = 'Run another script';
exports.requiredArgs = ['script'];

exports.choice = () => inquirer.prompt([
	{
		type: 'input',
		name: 'script',
		message: 'What script do you want to run?',
	},
	{
		type: 'list',
		name: 'parallel',
		message: 'Run all packages in parallel, or one at a time?',
		choices: [
			{value: false, name: 'Serial'},
			{value: true, name: 'Parallel'},
		]
	},
]);

exports.run = ({script, parallel, packages}) => (parallel
	? runPackagesParallel
	: runPackagesSerial)(
		script,
		packages
	);
