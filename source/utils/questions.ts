import { Question, Answers } from 'inquirer';

export interface SessionAnswersType extends Answers {
	sourceRepo: string;
	destRepo: string;
	deleteExisting: boolean;
	token: string;
}

const sessionQuestions: Question<SessionAnswersType>[] = [
	{
		name: 'sourceRepo',
		type: 'input',
		message: 'Enter repository name to sync labels from (org/repo):',
	},
	{
		name: 'destRepo',
		type: 'input',
		message: 'Enter your repository name (myname/myrepo):',
	},
	{
		name: 'deleteExisting',
		type: 'confirm',
		message: 'Do you want to delete existing additional labels for this repository?',
	},
	{
		name: 'token',
		type: 'password',
		message: 'Enter GitHub token:',
	},
];

export { sessionQuestions };
