class Stopwatch {
	start() {
		this.start = Date.now();
		this.end = undefined;
	}

	stop() {
		if (typeof this.start !== 'number') {
			throw new TypeError('.start() has not been called');
		}

		if (typeof this.end === 'number') {
			throw new TypeError('.stop() has already been called');
		}

		this.end = Date.now();
	}

	get duration() {
		if (typeof this.end !== 'number') {
			throw new TypeError('.stop() has not been called');
		}

		return Math.round((this.end - this.start) / 1000);
	}
}

module.exports = Stopwatch;
