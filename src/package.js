const path = require('path');

class Package {
	constructor (manifest, location) {
		this.manifest = manifest;
		this.location = location;
	}

	get name () {
		return this.manifest.name;
	}

	get nodeModulesLocation () {
		return path.join(this.location, 'node_modules');
	}

	get relativeLocation () {
		return path.relative(process.cwd(), this.location);
	}

	get dependencyNames () {
		return Object.keys({
			...this.manifest.dependencies,
			...this.manifest.devDependencies,
			...this.manifest.peerDependencies,
			...this.manifest.optionalDependencies
		});
	}

	get scripts () {
		return Object.assign({}, this.manifest.scripts);
	}
}

module.exports = Package;
