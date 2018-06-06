const path = require('path');
const chalkHash = require('@quarterto/chalk-hash');
const logger = require('../logger');
const chalk = require('chalk');
const spawn = require('../spawn');
const fs = require('fs-extra');

const getUniquePackageRoots = packages => Array.from(
	new Set(
		packages.map(
			pkg => path.dirname(pkg)
		)
	)
);

exports.label = 'Create a new package';
exports.choice = ({lernaJson, packages}) => {
	const uniqueRoots = getUniquePackageRoots(lernaJson.packages.concat(packages));

	return [
		{
			type: 'input',
			name: 'name',
			message: 'What\'s the package called?',
		},
		{
			type: 'list',
			name: 'folder',
			message: 'What folder should it go in?',
			choices: uniqueRoots,
			when: () => uniqueRoots.length > 1,
		},
	];
};

exports.requiredArgs = ['name'];

exports.run = async function({name, folder, packages}) {
	const uniqueRoots = getUniquePackageRoots(packages);

	if(!folder) {
		folder = uniqueRoots.includes('packages')
			? 'packages'
			: uniqueRoots[0];
	}

	logger.start(`creating ${chalk.cyan(name)} in ${chalk.blue(folder)}`);

	try {
		let [scope, pkgBase] = name.split('/');
		if(!pkgBase) {
			pkgBase = scope;
			scope = null;
		}

		const pkgDir = path.resolve(folder, pkgBase);
		await fs.mkdirs(pkgDir);

		const args = ['init', '-y'];

		if(scope) {
			args.push(`--scope=${scope}`);
		}

		await spawn('npm', args, {cwd: pkgDir});
		logger.success(`created package ${chalk.cyan(name)}`);
	} catch(e) {
		logger.failure(e.message);
		throw e;
	} finally {
		console.log('\n'); // clear a couple of lines
	}
};
