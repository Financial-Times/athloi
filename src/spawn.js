const byline = require('byline');
const { spawn } = require('child_process');

// npm prefixes each line with ">" which adds a lot of noise
const cleanLine = (line) => line.toString('utf8').replace(/^>\s+/, '');

module.exports = (cmd, args = [], opts = {}) => {
	return new Promise((resolve, reject) => {
		const logs = [];
		const child = spawn(cmd, args, { env: process.env, ...opts });

		// Closing the input stream is a micro-optimisation and can speed up a task by 100-200ms
		child.stdin.end();

		byline(child.stdout).on('data', (line) => logs.push(cleanLine(line)));

		byline(child.stderr).on('data', (line) => logs.push(cleanLine(line)));

		child.on('error', reject);

		child.on('exit', (code) => {
			if (code > 0) {
				const error = Error(`Exited with code ${code}`);
				error.code = code;
				error.logs = logs;

				reject(error);
			} else {
				resolve(logs);
			}
		});
	});
};
