const chalk = require('chalk');

const pkg = require('../package.json');
const { flashError } = require('./utils/flashMessages');
const validateArguments = require('./utils/validate');

const options = {};

const importGithubLabels = (_options, userInputs) => {
	const err = validateArguments(_options);

	if (err) {
		// show error & return
		flashError(err);

		return;
	}

	const { version } = options;

	if (version) {
		console.log(chalk(pkg.version));
	}
};

module.exports.options = options;
module.exports = importGithubLabels;
