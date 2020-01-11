import * as chalk from 'chalk';

/**
 *  Display Errors
 */
const flashError = (message: string | Error): void => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

export { flashError };
