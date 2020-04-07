#!/usr/bin/env node

/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

import cli from './cli';
import importGitHubLabels from './import';

((): void => {
	// initialize CLI
	importGitHubLabels(cli.flags, cli.input);
})();
