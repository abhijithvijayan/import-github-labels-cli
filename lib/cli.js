const pkg = require('../package.json');
const githubLabelsApi = require('./githubLabelsApi');
const validateArguments = require('./utils/validate');
const { flashError, showCliVersion } = require('./utils/flashMessages');

const options = {};

/**
 *  Handle `sync` command
 */
const handleSyncOperations = async () => {
	// create github api instance
	const labelsApiClient = githubLabelsApi('TODO GET TOKEN FROM USER INPUT');

	// get all labels from source repo
	const labels = await labelsApiClient.getLabels('USERNAME', 'REPO NAME');

	console.log(labels);
	// TODO:
	// iterate through all labels
	// create label in repo
	// read from next page (repeat prev steps)
};

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
		return showCliVersion(pkg.version);
	}

	// get user input command
	const userCommand = userInputs[0];

	if (!userCommand || userCommand !== 'sync') {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (userCommand === 'sync') {
		handleSyncOperations();
	}
};

module.exports.options = options;
module.exports = importGithubLabels;
