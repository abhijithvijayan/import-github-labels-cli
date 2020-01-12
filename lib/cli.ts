import * as inquirer from 'inquirer';

import githubLabelsApi from './githubLabelsApi';
import { flashError } from './utils/flashMessages';
import { sessionQuestions, sessionAnswersType } from './utils/questions';
import validateArguments, { CliFlags } from './utils/validate';

export interface CliOptions {
	version?: boolean | undefined;
}

// global object for cli validated options
export const options: CliOptions = {};

const syncRepositoryLabels = async ({ token, destRepo }: sessionAnswersType): Promise<null | Error> => {
	try {
		// create github api instance
		const labelsApiClient = githubLabelsApi(token);

		// get all labels from source repo
		const labels: [] = await labelsApiClient.getLabels(destRepo);

		console.log(labels);
		// TODO:
		// iterate through all labels
		// create label in repo

		return null;
	} catch (err) {
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
