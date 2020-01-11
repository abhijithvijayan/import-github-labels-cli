#!/usr/bin/env node

const meow = require('meow');
const importGitHubLabelsCLI = require('./cli');

const cli = meow(
	`
	Usage
	  $ import-github-labels [input]

	Options
	  -s, --sync             Import GitHub labels from a repo to another
   -v, --version          Show the version and exit with code 0

	Examples
	  $ import-github-labels sync
`,
	{
		flags: {
			boolean: ['version', 'sync'],
			string: [],
			alias: {
				v: 'version',
				s: 'sync',
			},
		},
	}
);

// initialize CLI
importGitHubLabelsCLI(cli.flags, cli.input);
