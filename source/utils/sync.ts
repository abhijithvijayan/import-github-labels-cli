import { Octokit } from '@octokit/rest';

import Spinner from './spinner';
import { SessionAnswersType } from './questions';
import githubLabelsApi, { LabelsApiClient } from '../githubLabelsApi';

interface DiffEntryProperties {
	name: string;
	type: string;
	actual: Octokit.IssuesGetLabelResponse | null;
	expected: Octokit.IssuesGetLabelResponse | null;
}

/**
 *  Mark label as `missing`
 */
function createMissingEntry({
	name,
	color,
	description,
	...other
}: Octokit.IssuesGetLabelResponse): DiffEntryProperties {
	const missingEntry: DiffEntryProperties = {
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
	existingEntry: Octokit.IssuesGetLabelResponse,
	newEntry: Octokit.IssuesGetLabelResponse
): DiffEntryProperties {
	const { description: existingDesc, ...existing } = existingEntry;
	const { description: newDesc, ...other } = newEntry;

	const updatableEntry: DiffEntryProperties = {
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
function createDeletableEntry({
	name,
	color,
	description,
	...other
}: Octokit.IssuesGetLabelResponse): DiffEntryProperties {
	const existingEntry: DiffEntryProperties = {
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
	currentLabels: Octokit.IssuesGetLabelResponse[],
	newLabels: Octokit.IssuesGetLabelResponse[]
): DiffEntryProperties[] {
	const diff: DiffEntryProperties[] = [];
	const mutualLabels: Octokit.IssuesGetLabelResponse[] = [];

	// compare new labels to old labels
	newLabels.forEach((newLabel: Octokit.IssuesGetLabelResponse): number | void => {
		// Get current labels which match the new label
		// eslint-disable-next-line array-callback-return
		const matches: Octokit.IssuesGetLabelResponse[] = currentLabels.filter(
			(currentLabel: Octokit.IssuesGetLabelResponse): boolean =>
				currentLabel.name.toLowerCase() === newLabel.name.toLowerCase()
		);

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
	const unMutualLabels: Octokit.IssuesGetLabelResponse[] = currentLabels.filter(
		(currentLabel: Octokit.IssuesGetLabelResponse) => mutualLabels.indexOf(currentLabel) === -1
	);
	unMutualLabels.map((existingLabel: Octokit.IssuesGetLabelResponse) =>
		diff.push(createDeletableEntry(existingLabel))
	);

	return diff;
}

type SyncActionResultProps = {
	type: string;
	status: boolean;
};

/**
 *  Iterate through labels & perform actions
 */
function syncLabelAction(
	apiClient: LabelsApiClient,
	diffLabels: DiffEntryProperties[],
	destRepo: string
): Promise<SyncActionResultProps[]> {
	return Promise.all(
		diffLabels.map(
			async (diffEntry: DiffEntryProperties): Promise<SyncActionResultProps> => {
				try {
					if (diffEntry.type === 'missing' && diffEntry.expected !== null) {
						await apiClient.createLabel(destRepo, diffEntry.expected);
					} else if (diffEntry.type === 'updatable' && diffEntry.expected !== null) {
						await apiClient.updateLabel(destRepo, diffEntry.expected);
					} else if (diffEntry.type === 'deletable' && diffEntry.actual !== null) {
						await apiClient.deleteLabel(destRepo, diffEntry.actual);
					}

					return { type: diffEntry.type, status: true };
				} catch (err) {
					return { type: diffEntry.type, status: false };
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
}: SessionAnswersType): Promise<null | Error> {
	console.log();
	const fetchSpinner = new Spinner('Fetching labels from GitHub...');

	try {
		// create github api instance
		const apiClient: LabelsApiClient = githubLabelsApi(token);

		fetchSpinner.start();
		// get all labels
		const oldLabels: Octokit.IssuesGetLabelResponse[] = await apiClient.getLabels(destRepo);
		const newLabels: Octokit.IssuesGetLabelResponse[] = await apiClient.getLabels(sourceRepo);

		// calculate the differences
		const labelDiff: DiffEntryProperties[] = calcLabelDifference(oldLabels, newLabels).filter(
			(diff: DiffEntryProperties): boolean => {
				// ignore deletable entries if user opted to keep them
				if (!deleteExisting && diff.type === 'deletable') {
					return false;
				}

				return true;
			}
		);

		fetchSpinner.succeed(`Fetched ${newLabels.length} labels from source repository`);
		fetchSpinner.start(`Syncing GitHub issue labels. Please wait...`);

		// perform create/update/delete actions
		const syncStatus: SyncActionResultProps[] = await syncLabelAction(apiClient, labelDiff, destRepo);

		let created = 0;
		let updated = 0;
		let deleted = 0;
		const successCount: number = syncStatus.filter(({ type, status }: SyncActionResultProps): boolean => {
			if (status) {
				if (type === 'missing') {
					created += 1;
				} else if (type === 'updatable') {
					updated += 1;
				} else if (type === 'deletable') {
					deleted += 1;
				}
			}

			return status && (type === 'missing' || type === 'updatable' || type === 'deletable');
		}).length;

		fetchSpinner.succeed(`Sync complete. ${successCount} successful, ${labelDiff.length - successCount} failed.`);
		fetchSpinner.succeed(`Created: ${created}, Updated: ${updated}, Deleted: ${deleted}`);

		return null;
	} catch (err) {
		fetchSpinner.fail('Failed to sync labels');

		return err;
	}
}
