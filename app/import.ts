import inquirer from 'inquirer';

import { flashError } from './utils/flashMessages';
import { syncRepositoryLabels } from './utils/sync';
import { sessionQuestions, SessionAnswersType } from './utils/questions';

type CliFlagsProps = {
	version?: boolean | undefined;
};

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

const importGitHubLabels = (_options: CliFlagsProps, userInputs: string[]): void => {
	// get user input command
	const userCommand = userInputs[0];

	if (!userCommand || userCommand !== 'sync') {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (userCommand === 'sync') {
		handleSyncOperations();
	}
};

export default importGitHubLabels;
