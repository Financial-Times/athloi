const rimraf = require('rimraf');
const { promisify } = require('util');

const rmrf = promisify(rimraf);

module.exports = (location) => rmrf(location, { glob: false });
