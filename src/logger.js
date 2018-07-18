const chalk = require('chalk');
const logSymbols = require('log-symbols');

const WS = '\x20';

const format = (symbol, color, message) => {
	return `${symbol} ${chalk[color](message)}\n`;
};

module.exports.info = (message) => {
	process.stdout.write(format(logSymbols.info, 'blue', message));
};

module.exports.message = (message) => {
	process.stdout.write(format(WS, 'gray', message));
};

module.exports.success = (message) => {
	process.stdout.write(format(logSymbols.success, 'green', message));
};

module.exports.warning = (message) => {
	process.stdout.write(format(logSymbols.warning, 'yellow', message));
};

module.exports.error = (message) => {
	process.stderr.write(format(logSymbols.error, 'red', message));
};
