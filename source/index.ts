#!/usr/bin/env node

/**
 *  import-github-labels
 *
 *  @author   abhijithvijayan <abhijithvijayan.in>
 *  @license  MIT License
 */

import cli from './cli';
import init from './init';
import importGitHubLabels from './utils/import';
import { flashError } from './utils/flashMessages';

(async (): Promise<void> => {
	init();
	// get user input command
	const [input] = cli.input;

	if (!input || input !== 'sync') {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	await importGitHubLabels();
})();
