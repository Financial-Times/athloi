const runPackagesParallel = require('../run-packages-parallel');

exports.label = 'Start the development server';
exports.run = ({packages}) => runPackagesParallel('start', packages);
