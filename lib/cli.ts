/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

import inquirer from 'inquirer';

import { flashError } from './utils/flashMessages';
import { syncRepositoryLabels } from './utils/sync';
import validateArguments, { CliFlags } from './utils/validate';
import { sessionQuestions, SessionAnswersType } from './utils/questions';

export interface CliOptions {
	version?: boolean | undefined;
}

// global object for cli validated options
export const options: CliOptions = {};

/**
 *  Handle `sync` command
 */
async function handleSyncOperations(): Promise<void> {
	// ask questions
	const userChoices: SessionAnswersType = await inquirer.prompt(sessionQuestions);
	const { sourceRepo, destRepo, token, deleteExisting } = userChoices;

	if (sourceRepo.trim().split('/').length !== 2) {
		return flashError('Error: Invalid source repository name.');
	}
	if (destRepo.trim().split('/').length !== 2) {
		return flashError('Error: Invalid destination repository name.');
	}
	if (token.trim() === '') {
		return flashError('Error: Invalid GitHub token.');
	}

	await syncRepositoryLabels({
		sourceRepo: sourceRepo.trim(),
		destRepo: destRepo.trim(),
		token: token.trim(),
		deleteExisting,
	});
}

// driver function
const importGithubLabels = (_options: CliFlags, userInputs: string[]): void => {
	const err: null | Error = validateArguments(_options);

	if (err) {
		// show error & return
		return flashError(err);
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
