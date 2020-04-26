import {Octokit} from '@octokit/rest';

export class LabelsApiClient {
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

  getLabels(repo: string): Promise<Octokit.IssuesGetLabelResponse[]> {
    const accountName: string = repo.split('/')[0];
    const repoName: string = repo.split('/')[1];

    const apiOptions = {
      owner: accountName,
      repo: repoName,
      per_page: 100,
    };

    try {
      const requestOptions: Octokit.RequestOptions = this._apiClient.issues.listLabelsForRepo.endpoint.merge(
        apiOptions
      );

      /**
       *  paginate responses for the registered endpoint
       *  docs: https://octokit.github.io/rest.js/#pagination
       */
      return this._apiClient.paginate(requestOptions);
    } catch (err) {
      // GitHub API Error
      return err;
    }
  }

  createLabel(
    repo: string,
    label: Octokit.IssuesCreateLabelResponse
  ): Promise<Octokit.Response<Octokit.IssuesCreateLabelResponse>> {
    const accountName: string = repo.split('/')[0];
    const repoName: string = repo.split('/')[1];
    const {name, color, description} = label;

    try {
      return this._apiClient.issues.createLabel({
        color,
        description,
        name,
        owner: accountName,
        repo: repoName,
      });
    } catch (err) {
      // creation failed
      return err;
    }
  }

  updateLabel(
    repo: string,
    label: Octokit.IssuesGetLabelResponse
  ): Promise<Octokit.Response<Octokit.IssuesUpdateLabelResponse>> {
    const accountName: string = repo.split('/')[0];
    const repoName: string = repo.split('/')[1];
    const {name, color, description} = label;

    try {
      return this._apiClient.issues.updateLabel({
        owner: accountName,
        repo: repoName,
        current_name: name,
        color,
        description,
      });
    } catch (err) {
      // updation failed
      return err;
    }
  }

  deleteLabel(
    repo: string,
    label: Octokit.IssuesGetLabelResponse
  ): Promise<Octokit.AnyResponse> {
    const accountName: string = repo.split('/')[0];
    const repoName: string = repo.split('/')[1];
    const {name} = label;

    try {
      return this._apiClient.issues.deleteLabel({
        owner: accountName,
        repo: repoName,
        name,
      });
    } catch (err) {
      return err;
    }
  }
}

const createApiClient = (accessToken: string): LabelsApiClient =>
  new LabelsApiClient(accessToken);

export default createApiClient;
