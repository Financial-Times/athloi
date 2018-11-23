const wait = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = (check) => {
	return new Promise((resolve) => {
		const test = () => {
			if (check()) {
				resolve();
			} else {
				wait().then(test);
			}
		};

		test();
	});
};
