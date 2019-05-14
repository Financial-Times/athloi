const ora = require('ora');

const spinner = exports.spinner = ora({
	isEnabled: process.env.NODE_ENV !== 'test'
});

exports.info = (message) => {
	spinner.info(message).start();
};

exports.debug = (message) => {
	spinner.stopAndPersist({ symbol: ' ', text: message }).start();
};

exports.success = (message) => {
	spinner.succeed(message).start();
};

exports.warning = (message) => {
	spinner.warn(message).start();
};

exports.error = (message) => {
	spinner.fail(message).start();
};

exports.endWithSuccess = (message) => {
	spinner.stopAndPersist({ symbol: '✨', text: message });
};

exports.endWithFailure = (message) => {
	spinner.stopAndPersist({ symbol: '💥', text: message });
};
