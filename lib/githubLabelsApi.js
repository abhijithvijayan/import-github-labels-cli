const GitHubApi = require('@octokit/rest');

class LabelsApiClient {
	constructor(accessToken) {
		const defaultOptions = {
			userAgent: 'Import-GitHub-Labels',
			accept: 'application/vnd.github.symmetra-preview+json', // Enable emoji + description support
			auth: accessToken,
		};

		this.apiClient = new GitHubApi(defaultOptions);
	}
}

const createApiClient = accessToken => {
	return new LabelsApiClient(accessToken);
};

module.exports = createApiClient;
