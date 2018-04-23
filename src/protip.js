const logger = require('./logger');
const chalk = require('chalk');
const omit = require('lodash.omit');
const escapeShellArg = require('escapeshellarg');
const {argvSeparated} = require('./argv-zero');

const formatArg = (name, val) => typeof val === 'boolean'
	? val ? `--${name}` : ''
	: `--${name} ${escapeShellArg(val)}`;

const formatArgs = args => Object.keys(args)
	.map(name => formatArg(name, args[name]))
	.join(' ');

module.exports = async (task, args) => {
	const argsString = formatArgs(omit(args, ['_', 'packages', 'lernaJson']));
	const positional = args._;
	if(positional[0] === task) {
		positional.shift();
	}

	const posString = positional.map(escapeShellArg).join(' ');

	console.log();

	logger.protip('protip');
	logger.message(
		`you can run this as ${argvSeparated} ${chalk.green(task)} ${chalk.cyan(argsString)}  ${chalk.grey(posString)}`
	);
	logger.success(chalk.grey.italic('which would be quicker'));

	console.log();

	await new Promise(r => setTimeout(r, 3000));
};
