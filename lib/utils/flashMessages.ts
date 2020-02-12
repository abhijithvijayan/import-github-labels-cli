import chalk from 'chalk';

/**
 *  Display Errors
 */
function flashError(message: string | Error): void {
	console.error(chalk.bold.red(`✖ ${message}`));

	process.exit(1);
}

export { flashError };
