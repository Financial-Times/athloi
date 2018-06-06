const findUp = require('find-up');

const defaultChoose = () => [];

module.exports = async function(tasks) {
	const athloiJs = await findUp('athloi.js');

	if(athloiJs) {
		return require(athloiJs)({
			addPrompt: (choose = defaultChoose, extraPrompt) => argv =>
				choose(argv).concat(
					extraPrompt(argv)
				),
			prompt: prompts => prompts, // for backwards compatibility
			tasks,
		});
	}

	return {};
}
