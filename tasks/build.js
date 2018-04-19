const runPackagesSerial = require('../run-packages-serial');

exports.run = ({packages}) => runPackagesSerial('build', packages);
