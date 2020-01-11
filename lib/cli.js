const chalk = require('chalk');

const pkg = require('../package.json');
const { flashError } = require('./utils/flashMessages');
const validateArguments = require('./utils/validate');

const options = {};

// driver function
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

	// get user input command
	const userCommand = userInputs[0];

	if (!userCommand || userCommand !== 'sync') {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (userCommand === 'sync') {
		// TODO:
		// create github api instance
		// authenticate with github
		// copy label from one repo to another
		// 1. get all labels from source
		// 2. iterate through all labels
		// 3. create label in repo
		// 4. read from next page (repeat prev steps)
	}
};

module.exports.options = options;
module.exports = importGithubLabels;
