module.exports = (tasks = []) => {
	// TODO: support concurrency level (maybe async-sema?)
	return Promise.all(tasks.map((task) => task()));
};
