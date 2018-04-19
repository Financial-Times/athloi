const runPackagesSerial = require('../run-packages-serial');
const runPackagesParallel = require('../run-packages-parallel');
const inquirer = require('inquirer');

exports.label = 'Run another script';

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
			{value: true, name: 'Parallel'},
			{value: false, name: 'Serial'},
		]
	},
]);

exports.run = ({script, parallel, packages}) => (parallel
	? runPackagesParallel
	: runPackagesSerial)(
		script,
		packages
	);
