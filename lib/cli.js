const chalk = require('chalk');

const pkg = require('../package.json');
const validateArguments = require('./utils/validate');

const options = {};

const importGithubLabels = (_options, userInputs) => {
	const err = validateArguments(_options);

	if (err) {
		// show error & return
	}

	// TODO:

	// create github api instance

	// authenticate with github

	// copy label from one repo to another
	// 1. get all labels from source
	// 2. iterate through all labels
	// 3. create label in repo
	// 4. read from next page (repeat prev steps)
};

module.exports.options = options;
module.exports = importGithubLabels;
