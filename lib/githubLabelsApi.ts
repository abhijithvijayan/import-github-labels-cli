import * as Octokit from '@octokit/rest';

class LabelsApiClient {
	_apiClient: Octokit;

	constructor(accessToken: string) {
		const defaultOptions = {
			auth: accessToken,
			baseUrl: 'https://api.github.com',
			userAgent: 'Import-GitHub-Labels',
			accept: 'application/vnd.github.symmetra-preview+json', // Enable emoji + description support
		};

		// authenticate with github
		this._apiClient = new Octokit(defaultOptions);
	}

	getLabels(owner: string, repo: string): Promise<any> {
		const apiOptions = {
			owner,
			repo,
			per_page: 100,
		};

		try {
			/**
			 *  paginate responses for the registered endpoint
			 *  docs: https://octokit.github.io/rest.js/#pagination
			 */
			const requestOptions = this._apiClient.issues.listLabelsForRepo.endpoint.merge(apiOptions);

			return this._apiClient.paginate(requestOptions);
		} catch (err) {
			// GitHub API Error
			return err;
		}
	}
}

const createApiClient = (accessToken: string) => {
	return new LabelsApiClient(accessToken);
};

export default createApiClient;
