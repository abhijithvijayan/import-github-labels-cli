#!/usr/bin/env node

/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

import cli from './cli';
import importGitHubLabels from './utils/import';
import { flashError } from './utils/flashMessages';

((): void => {
	// get user input command
	const [input] = cli.input;

	if (!input || input !== 'sync') {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	importGitHubLabels();
})();
