const chalk = require('chalk');
const path = require('path');

let zero = path.basename(process.argv[1]);
let full = zero;

if(process.env.npm_lifecycle_event) {
	let npmRunScript = process.env.npm_lifecycle_event;
	if(!['start', 'test'].includes(npmRunScript)) {
		npmRunScript = `run ${npmRunScript}`;
	}

	zero = `npm ${npmRunScript}`;
	full = `${zero} ${chalk.grey('--')}`;
}

exports.argvZero = chalk.magenta(zero);
exports.argvSeparated = chalk.magenta(full);
