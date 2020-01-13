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
			description: (description && description.trim()) || '',
		},
	};

	return missingEntry;
};

const createUpdatableEntry = (
	existingEntry: IssuesGetLabelResponse,
	newEntry: IssuesGetLabelResponse
): diffEntryProperties => {
	const updatableEntry: diffEntryProperties = {
		name: existingEntry.name,
		type: 'update',
		actual: {
			name: existingEntry.name,
			color: existingEntry.color,
			description: (existingEntry.description && existingEntry.description.trim()) || '',
		},
		expected: {
			name: newEntry.name,
			color: newEntry.color,
			description: (newEntry.description && newEntry.description.trim()) || '',
		},
	};

	return updatableEntry;
};

const createDeletableEntry = ({ name, color, description }: IssuesGetLabelResponse): diffEntryProperties => {
	const existingEntry: diffEntryProperties = {
		name,
		type: 'deletable',
		actual: {
			name,
			color,
			description: (description && description.trim()) || '',
		},
		expected: null,
	};

	return existingEntry;
};

const calcLabelDifference = (
	currentLabels: IssuesGetLabelResponse[],
	newLabels: IssuesGetLabelResponse[]
): diffEntryProperties[] => {
	const diff: diffEntryProperties[] = [];
	const mutualLabels: IssuesGetLabelResponse[] = [];

	// compare new labels to old labels
	newLabels.forEach((newLabel: IssuesGetLabelResponse): number | void => {
		// Get current labels which match the new label
		const matches = currentLabels.filter((currentLabel: IssuesGetLabelResponse): boolean | void => {
			if (currentLabel.name.toLowerCase() === newLabel.name.toLowerCase()) {
				return true;
			}
		});

		// If we have no matches, the new label is missing
		if (matches.length === 0) {
			return diff.push(createMissingEntry(newLabel));
		}

		// Always take the first match
		const matchedLabel = matches[0];
		// create list of mutual items
		mutualLabels.push(matchedLabel);

		const matchedLabelDescription = (matchedLabel.description && matchedLabel.description.trim()) || '';
		const newLabelDescription = (newLabel.description && newLabel.description.trim()) || '';

		// if we have a match, but properties are not equal
		if (matchedLabel.color !== newLabel.color || matchedLabelDescription !== newLabelDescription) {
			return diff.push(createUpdatableEntry(matchedLabel, newLabel));
		}
	});

	// find odd ones out (exists on dest repo but not on source repo)
	const unMutualLabels: IssuesGetLabelResponse[] = currentLabels.filter((currentLabel: IssuesGetLabelResponse) => {
		return mutualLabels.indexOf(currentLabel) === -1;
	});
	unMutualLabels.map((existingLabel: IssuesGetLabelResponse) => {
		return diff.push(createDeletableEntry(existingLabel));
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
		// get all labels
		const oldLabels = await apiClient.getLabels(destRepo);
		const newLabels = await apiClient.getLabels(sourceRepo);

		calcLabelDifference(oldLabels, newLabels);

		fetchSpinner.succeed(`Fetched ${newLabels.length} labels from repository`);
		// perform actions
		await syncLabelAction(apiClient, newLabels, destRepo);

		return null;
	} catch (err) {
		fetchSpinner.fail('Failed to fetch labels');
		// failed to fetch labels
		return err;
	}
};
