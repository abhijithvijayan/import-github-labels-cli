import * as inquirer from 'inquirer';
import { IssuesGetLabelResponse } from '@octokit/rest';

import Spinner from './utils/spinner';
import { flashError } from './utils/flashMessages';
import validateArguments, { CliFlags } from './utils/validate';
import githubLabelsApi, { LabelsApiClient } from './githubLabelsApi';
import { sessionQuestions, sessionAnswersType } from './utils/questions';

export interface CliOptions {
	version?: boolean | undefined;
}

// global object for cli validated options
export const options: CliOptions = {};

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

const syncRepositoryLabels = async ({ token, sourceRepo, destRepo }: sessionAnswersType): Promise<null | Error> => {
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

/**
 *  Handle `sync` command
 */
const handleSyncOperations = async (): Promise<void> => {
	// ask questions
	const userChoices: sessionAnswersType = await inquirer.prompt(sessionQuestions);
	const { sourceRepo, destRepo, token } = userChoices;

	if (sourceRepo.split('/').length !== 2) {
		return flashError('Error: Invalid source repository name.');
	}
	if (destRepo.split('/').length !== 2) {
		return flashError('Error: Invalid destination repository name.');
	}
	if (token === '') {
		return flashError('Error: Invalid GitHub token.');
	}

	await syncRepositoryLabels(userChoices);
};

// driver function
const importGithubLabels: any = (_options: CliFlags, userInputs: string[]) => {
	const err: null | Error = validateArguments(_options);

	if (err) {
		// show error & return
		flashError(err);

		return;
	}

	// get user input command
	const userCommand = userInputs[0];

	if (!userCommand || userCommand !== 'sync') {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (userCommand === 'sync') {
		handleSyncOperations();
	}
};

export default importGithubLabels;
