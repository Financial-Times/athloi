const runPackagesSerial = require('../run-packages-serial');

exports.label = 'Run the production build';
exports.run = ({packages}) => runPackagesSerial('build', packages);
