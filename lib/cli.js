const GitHubApi = require('@octokit/rest');

const importGithubLabels = (flags, input) => {
	return { flags, input };

	// TODO:

	// create github api instance

	// authenticate with github

	// copy label from one repo to another
	// 1. get all labels from source
	// 2. iterate through all labels
	// 3. create label in repo
	// 4. read from next page (repeat prev steps)
};

module.exports = importGithubLabels;
