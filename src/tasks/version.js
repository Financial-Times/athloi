const semver = require('semver');
const logger = require('../logger');
const taskify = require('../cli-task');
const updateVersions = require('../update-versions');
const getLatestVersions = require('../get-latest-versions');

async function version (targetPackages = [], tag, allPackages = []) {
	// Projects may use different tag formats
	const number = semver.clean(tag);

	if (semver.valid(number)) {
		logger.info(`Updating packages to version ${number}`);
	} else {
		throw Error(`The given tag "${tag}" is not a valid version number`);
	}

	// Fetch the latest versions for every package from npm
	const latestVersions = await getLatestVersions(allPackages);
	// Only bump the version for the list of target packages
	const packageNames = new Set(targetPackages.map((pkg) => pkg.name));

	return targetPackages.map((pkg) => {
		const apply = () => {
			const newManifest = updateVersions(pkg.manifest, packageNames, number, latestVersions);
			return pkg.writeManifest(newManifest);
		};

		return { pkg, apply };
	});
};

exports.task = version;

exports.register = (program) => {
	program
		.command('version <tag>')
		.description('Updates the release number for public packages and their cross-dependencies and writes the data back to package.json')
		.action(taskify(version));
};
