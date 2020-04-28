import 'unicorn.log';
import chalk from 'chalk';

/**
 *  Display Errors
 */
function flashError(message: string | Error): void {
  console.unicorn(chalk.bold.red(`✖ ${message}`), 31);

  process.exit(1);
}

export {flashError};
