const semver = require('semver');
const logger = require('../logger');
const taskify = require('../cli-task');
const updateVersions = require('../update-versions');

function version (packages = [], tag, flags) {
	// Projects may use different tag formats
	const number = semver.clean(tag);

	if (semver.valid(number)) {
		logger.info(`Updating packages to version ${number}`);
	} else {
		throw Error(`The given tag "${tag}" is not a valid version number`);
	}

	const packageNames = new Set(packages.map((pkg) => pkg.name));

	return packages.map((pkg) => {
		const apply = () => {
			const newManifest = updateVersions(pkg.manifest, number, flags.exactVersion, packageNames);
			return pkg.writeManifest(newManifest);
		};

		return { pkg, apply };
	});
};

exports.task = version;

exports.register = (program) => {
	program
		.command('version <tag>')
		.description('Updates the release number for all packages and writes the new data back to package.json')
		.option('-E, --exact-version', 'Use exact version specifier')
		.action(taskify(version));
};
