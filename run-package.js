const path = require('path');
const pushd = require('@quarterto/in-dir');
const crossSpawn = require('cross-spawn');
const chalkHash = require('@quarterto/chalk-hash');
const byline = require('byline');
const logger = require('./logger');
const chalk = require('chalk');

const cleanLine = line => {
	return line.toString('utf8');
};

const spawn = (cmd, args) => new Promise((resolve, reject) => {
	const child = crossSpawn(cmd, args, {
		env: Object.assign({
			FORCE_COLOR: '1', // henlo chalk
		}, process.env),
	});

	byline(child.stdout, {keepEmptyLines: true}).on('data', line => logger.message(cleanLine(line)));
	byline(child.stderr, {keepEmptyLines: true}).on('data', line => logger.error(cleanLine(line)));
	child.on('error', reject);

	child.on('close', code => {
		if(code > 0) {
			const message = `${chalk.green('npm')} ${chalk.cyan(args.join(' '))} exited with code ${chalk.red(code)}`;
			reject(new Error(message));
		} else {
			resolve();
		}
	});
});

module.exports = async function runPackage(command, pkgDir, {log = true} = {}) {
	const pkgName = path.basename(pkgDir);
	log && logger.start(chalkHash(command) + ' ' + chalkHash(pkgName));

	const popd = await pushd(pkgDir);

	try {
		await spawn('npm', ['run', command], {stdio: 'inherit'});
		log && logger.success(chalkHash(command) + ' ' + chalkHash(pkgName) + ' succeeded');
	} catch(e) {
		log && logger.failure(e.message);
		throw e;
	} finally {
		console.log('\n'); // clear a couple of lines
		await popd();
	}
};
