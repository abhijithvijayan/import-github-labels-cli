import inquirer from 'inquirer';

import { flashError } from './flashMessages';
import { syncRepositoryLabels } from './sync';
import { sessionQuestions, SessionAnswersType } from './questions';

/**
 *  Handle `sync` command
 */
async function importGitHubLabels(): Promise<void> {
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

export default importGitHubLabels;
