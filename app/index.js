#!/usr/bin/env node

const meow = require('meow');
const cliApp = require('./cli');

const cli = meow(
	`
	Usage
	  $ cli-name [input]

	Options
	  --token  Lorem ipsum  [Default: nothing]

	Examples
	  $ cli-name create --message "hello"
`,
	{
		flags: {
			boolean: ['version'],
			string: ['token'],
			alias: {
				t: 'token',
				v: 'version',
			},
		},
	}
);

console.log(cliApp(cli.input || 'cli app', cli.flags));
