import { IssuesGetLabelResponse } from '@octokit/rest';

import Spinner from './spinner';
import { sessionAnswersType } from './questions';
import githubLabelsApi, { LabelsApiClient } from '../githubLabelsApi';

/**
 *  Iterate through labels & perform action
 */
const syncLabelAction = (
	apiClient: LabelsApiClient,
	labels: IssuesGetLabelResponse[],
	destRepo: string
): Promise<boolean[]> => {
	return Promise.all(
		labels.map(
			async (label): Promise<boolean> => {
				try {
					// ToDo: based on choice -> create or update
					await apiClient.createLabel(destRepo, label);

					return true;
				} catch (err) {
					return false;
				}
			}
		)
	);
};

export const syncRepositoryLabels = async ({
	token,
	sourceRepo,
	destRepo,
}: sessionAnswersType): Promise<null | Error> => {
	console.log();
	const fetchSpinner = new Spinner('Fetching labels from GitHub');

	try {
		// create github api instance
		const apiClient: LabelsApiClient = githubLabelsApi(token);

		fetchSpinner.start();
		// get all labels from source repo
		const labels = await apiClient.getLabels(sourceRepo);

		fetchSpinner.succeed(`Fetched ${labels.length} labels from repository`);
		// perform actions
		await syncLabelAction(apiClient, labels, destRepo);

		return null;
	} catch (err) {
		fetchSpinner.fail('Failed to fetch labels');
		// failed to fetch labels
		return err;
	}
};
