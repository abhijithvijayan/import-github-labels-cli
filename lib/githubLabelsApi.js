const GitHubApi = require('@octokit/rest');

class LabelsApiClient {
	constructor(accessToken) {
		const defaultOptions = {
			auth: accessToken,
			baseUrl: 'https://api.github.com',
			userAgent: 'Import-GitHub-Labels',
			accept: 'application/vnd.github.symmetra-preview+json', // Enable emoji + description support
		};

		// authenticate with github
		this._apiClient = new GitHubApi(defaultOptions);
	}
}

const createApiClient = accessToken => {
	return new LabelsApiClient(accessToken);
};

module.exports = createApiClient;
