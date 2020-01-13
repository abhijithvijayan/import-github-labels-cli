import { IssuesGetLabelResponse } from '@octokit/rest';

import Spinner from './spinner';
import { sessionAnswersType } from './questions';
import githubLabelsApi, { LabelsApiClient } from '../githubLabelsApi';

interface diffEntryProperties {
	name: string;
	type: string;
	actual: {
		name: string;
		color: string;
		description: string;
	} | null;
	expected: {
		name: string;
		color: string;
		description: string;
	} | null;
}

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

const createMissingEntry = ({ name, color, description }: IssuesGetLabelResponse): diffEntryProperties => {
	const missingEntry: diffEntryProperties = {
		name,
		type: 'missing',
		actual: null,
		expected: {
			name,
			color,
			description: description || '',
		},
	};

	return missingEntry;
};

const calcLabelDifference = (
	currentLabels: IssuesGetLabelResponse[],
	newLabels: IssuesGetLabelResponse[]
): diffEntryProperties[] => {
	const diff: diffEntryProperties[] = [];

	newLabels.forEach((newLabel: IssuesGetLabelResponse): number | void => {
		// Get current labels which match the new labels
		const matches = currentLabels.filter((currentLabel: IssuesGetLabelResponse): boolean | void => {
			if (currentLabel.name.toLowerCase() === newLabel.name.toLowerCase()) {
				return true;
			}
			// ToDo: check for alias if present
		});

		// If we have no matches, the new label is missing
		if (matches.length === 0) {
			return diff.push(createMissingEntry(newLabel));
		}

		// ToDo: Do for we have a match, but properties are not equal
	});

	return diff;
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
