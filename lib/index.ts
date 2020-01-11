#!/usr/bin/env node

const meow = require('meow');
const importGitHubLabelsCLI = require('./cli');

const cli = meow(
	`
	Usage
	  $ import-github-labels [input] [options]

	Input
		sync		Import GitHub labels from a repo to another

	Options
		-v, --version   Show the version and exit with code 0

  Examples
		$ import-github-labels sync
`,
	{
		flags: {
			input: ['sync'],
			boolean: ['version'],
			string: [],
			alias: {
				v: 'version',
			},
		},
	}
);

// initialize CLI
importGitHubLabelsCLI(cli.flags, cli.input);
