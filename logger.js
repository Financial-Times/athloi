const symbolLogger = require('@quarterto/symbol-logger');
const chalk = require('chalk');

module.exports = symbolLogger({
	start: {
		symbol: '⛭',
		format: 'blue',
	},
	success: {
		symbol: '✔︎',
		format: 'green',
	},
	failure: {
		symbol: '✘',
		format: chalk.red.bold,
	},
	message: {
		symbol: '│',
	},
	error: {
		symbol: '┃',
		format: 'red',
	},
	protip: {
		symbol: '☞',
		format: chalk.blue.bold,
		formatLine: chalk.blue.bold.italic,
	},
});
