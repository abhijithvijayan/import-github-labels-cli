const cli = require('../cli');

const validateArguments = _options => {
	const { options } = cli;

	if (
		Object.prototype.hasOwnProperty.call(_options, 'version') ||
		Object.prototype.hasOwnProperty.call(_options, 'v')
	) {
		options.version = _options.version || _options.v;
	}

	return null;
};

module.exports = validateArguments;
