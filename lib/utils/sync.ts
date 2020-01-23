import { IssuesGetLabelResponse } from '@octokit/rest';

import Spinner from './spinner';
import { sessionAnswersType } from './questions';
import githubLabelsApi, { LabelsApiClient } from '../githubLabelsApi';

interface diffEntryProperties {
	name: string;
	type: string;
	actual: IssuesGetLabelResponse | null;
	expected: IssuesGetLabelResponse | null;
}

/**
 *  Mark label as `missing`
 */
function createMissingEntry({ name, color, description, ...other }: IssuesGetLabelResponse): diffEntryProperties {
	const missingEntry: diffEntryProperties = {
		name,
		type: 'missing',
		actual: null,
		expected: {
			name,
			color,
			description: (description && description.trim()) || '',
			...other,
		},
	};

	return missingEntry;
}

/**
 *  Mark label as `updatable`
 */
function createUpdatableEntry(
	existingEntry: IssuesGetLabelResponse,
	newEntry: IssuesGetLabelResponse
): diffEntryProperties {
	const { description: existingDesc, ...existing } = existingEntry;
	const { description: newDesc, ...other } = newEntry;

	const updatableEntry: diffEntryProperties = {
		name: existingEntry.name,
		type: 'updatable',
		actual: {
			description: (existingDesc && existingDesc.trim()) || '',
			...existing,
		},
		expected: {
			description: (newDesc && newDesc.trim()) || '',
			...other,
		},
	};

	return updatableEntry;
}

/**
 *  Mark label as `deletable`
 */
function createDeletableEntry({ name, color, description, ...other }: IssuesGetLabelResponse): diffEntryProperties {
	const existingEntry: diffEntryProperties = {
		name,
		type: 'deletable',
		actual: {
			name,
			color,
			description: (description && description.trim()) || '',
			...other,
		},
		expected: null,
	};

	return existingEntry;
}

/**
 *  Classify all labels & find differences
 */
function calcLabelDifference(
	currentLabels: IssuesGetLabelResponse[],
	newLabels: IssuesGetLabelResponse[]
): diffEntryProperties[] {
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
}

/**
 *  Iterate through labels & perform actions
 */
function syncLabelAction(
	apiClient: LabelsApiClient,
	diffLabels: diffEntryProperties[],
	destRepo: string
): Promise<boolean[]> {
	return Promise.all(
		diffLabels.map(
			async (diffEntry: diffEntryProperties): Promise<boolean> => {
				try {
					if (diffEntry.type === 'missing' && diffEntry.expected !== null) {
						await apiClient.createLabel(destRepo, diffEntry.expected);
					} else if (diffEntry.type === 'updatable' && diffEntry.expected !== null) {
						await apiClient.updateLabel(destRepo, diffEntry.expected);
					} else if (diffEntry.type === 'deletable' && diffEntry.actual !== null) {
						await apiClient.deleteLabel(destRepo, diffEntry.actual);
					}

					return true;
				} catch (err) {
					return false;
				}
			}
		)
	);
}

export async function syncRepositoryLabels({
	token,
	sourceRepo,
	destRepo,
	deleteExisting,
}: sessionAnswersType): Promise<null | Error> {
	console.log();
	const fetchSpinner = new Spinner('Fetching labels from GitHub');

	try {
		// create github api instance
		const apiClient: LabelsApiClient = githubLabelsApi(token);

		fetchSpinner.start();
		// get all labels
		const oldLabels = await apiClient.getLabels(destRepo);
		const newLabels = await apiClient.getLabels(sourceRepo);

		// calculate the differences
		const labelDiff: diffEntryProperties[] = calcLabelDifference(oldLabels, newLabels).filter(
			(diff: diffEntryProperties) => {
				// ignore deletable entries if user opted to keep them
				if (!deleteExisting && diff.type === 'deletable') {
					return false;
				}

				return true;
			}
		);

		fetchSpinner.succeed(`Fetched ${newLabels.length} labels from repository`);
		// perform actions
		await syncLabelAction(apiClient, labelDiff, destRepo);

		return null;
	} catch (err) {
		fetchSpinner.fail('Failed to fetch labels');
		// failed to fetch labels
		return err;
	}
}
