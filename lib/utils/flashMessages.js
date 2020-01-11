const chalk = require('chalk');

/**
 *  Display Errors
 */
const flashError = message => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

const showCliVersion = version => {
	console.log(chalk(version));
	process.exit(1);
};

module.exports = { flashError, showCliVersion };
