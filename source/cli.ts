import meow from 'meow';

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

export default cli;
