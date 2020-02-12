#!/usr/bin/env node

import meow from 'meow';
import importGitHubLabelsCLI from './cli';

const cli = meow(
	`
	Usage
	  $ import-github-labels <input> [options]

	Input
		sync		Import GitHub labels from a repo to another

	Options
		-v, --version   Show the version and exit with code 0

  Examples
		$ import-github-labels sync
`,
	{
		flags: {
			version: {
				type: 'boolean',
				alias: 'v',
			},
		},
	}
);

// initialize CLI
importGitHubLabelsCLI(cli.flags, cli.input);
