const chalk = require('chalk');
const logSymbols = require('log-symbols');

const WS = '\x20';

const format = (symbol, color, message) => {
	return `${symbol} ${chalk[color](message)}\n`;
};

exports.info = (message) => {
	process.stdout.write(format(logSymbols.info, 'blue', message));
};

exports.debug = (message) => {
	process.stdout.write(format(WS, 'gray', message));
};

exports.success = (message) => {
	process.stdout.write(format(logSymbols.success, 'green', message));
};

exports.warning = (message) => {
	process.stdout.write(format(logSymbols.warning, 'yellow', message));
};

exports.error = (message) => {
	process.stderr.write(format(logSymbols.error, 'red', message));
};
