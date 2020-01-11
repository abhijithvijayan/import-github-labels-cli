import githubLabelsApi from './githubLabelsApi';
import validateArguments, { CliFlags } from './utils/validate';
import { flashError } from './utils/flashMessages';

export interface CliOptions {
	version?: boolean | undefined;
}

// global object for cli validated options
export const options: CliOptions = {};

/**
 *  Handle `sync` command
 */
const handleSyncOperations = async (): Promise<void> => {
	try {
		// create github api instance
		const labelsApiClient = githubLabelsApi('TODO GET TOKEN FROM USER INPUT');

		// get all labels from source repo
		const labels = await labelsApiClient.getLabels('USERNAME', 'REPO NAME');

		console.log(labels);
		// TODO:
		// iterate through all labels
		// create label in repo
		// read from next page (repeat prev steps)
	} catch (err) {}
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
