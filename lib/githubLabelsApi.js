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

	getLabels(owner, repo) {
		const reqOptions = {
			owner,
			repo,
			// raise to 100
			per_page: 3,
		};

		let labels = [];

		try {
			/**
			 *  paginate responses for the registered endpoint
			 *  docs: https://octokit.github.io/rest.js/#pagination
			 */
			const options = this._apiClient.issues.listLabelsForRepo.endpoint.merge(reqOptions);
			labels = this._apiClient.paginate(options);
		} catch (err) {
			// GitHub API Error
		}

		return labels;
	}
}

const createApiClient = accessToken => {
	return new LabelsApiClient(accessToken);
};

module.exports = createApiClient;
