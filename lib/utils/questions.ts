import { Question, Answers } from 'inquirer';

export interface sessionAnswersType extends Answers {
	sourceRepo: string;
	destRepo: string;
	deleteExisting: boolean;
	token: string;
}

const sessionQuestions: Question<sessionAnswersType>[] = [
	{
		name: 'sourceRepo',
		type: 'input',
		message: 'Enter your repository name (myname/myrepo):',
	},
	{
		name: 'destRepo',
		type: 'input',
		message: 'Enter repository name to sync labels from (org/repo):',
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
