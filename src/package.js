const fs = require('fs');
const path = require('path');
const util = require('util');

// TODO: switch to fs.promises when Node 10+ is the default
const writeFile = util.promisify(fs.writeFile);

class Package {
	constructor (manifest, location) {
		this.manifest = manifest;
		this.location = location;
	}

	get name () {
		return this.manifest.name;
	}

	get manifestLocation () {
		return path.join(this.location, 'package.json');
	}

	get nodeModulesLocation () {
		return path.join(this.location, 'node_modules');
	}

	get relativeLocation () {
		return path.relative(process.cwd(), this.location);
	}

	async writeManifest (manifest) {
		const json = JSON.stringify(manifest, null, 2);
		await writeFile(this.manifestLocation, json);
		this.manifest = manifest;
	}
}

module.exports = Package;
