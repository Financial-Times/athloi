const semver = require('semver');
const logger = require('../logger');
const taskify = require('../cli-task');
const updateVersions = require('../update-versions');

async function version (packages = [], tag) {
	// Projects may use different tag formats
	const number = semver.clean(tag);

	if (semver.valid(number)) {
		logger.info(`Updating packages to version ${number}`);
	} else {
		throw Error(`The given tag "${tag}" is not a valid version number`);
	}

	const packageNames = new Set(packages.map((pkg) => pkg.name));

	return packages.map((pkg) => {
		return () => {
			const newManifest = updateVersions(pkg.manifest, number, packageNames);
			return pkg.writeManifest(newManifest);
		};
	});
};

module.exports.register = (program) => {
	program
		.command('version <tag>')
		.description('Bump the version number for all packages.')
		.action(taskify(version));
};
