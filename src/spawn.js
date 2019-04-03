const byline = require('byline');
const { spawn } = require('child_process');
const logger = require('./logger');

const cleanLine = (line) => line.toString('utf8');

module.exports = (cmd, args = [], opts = {}) => {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, { env: process.env, ...opts });

		// Closing the input stream is a micro-optimisation and can speed up a task by 100-200ms
		child.stdin.end();

		byline(child.stdout).on('data', (line) => logger.message(cleanLine(line)));

		// stderr is not always used for error logging so rely on non-zero exit code
		byline(child.stderr).on('data', (line) => logger.message(cleanLine(line)));

		child.on('error', reject);

		child.on('exit', (code) => {
			if (code > 0) {
				reject(Error(`${cmd} exited with code ${code}`));
			} else {
				resolve();
			}
		});
	});
};
