module.exports = (tasks = []) => {
	return tasks.reduce((current, next) => current.then(next), Promise.resolve());
};
