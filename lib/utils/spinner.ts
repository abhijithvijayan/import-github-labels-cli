import * as ora from 'ora';

class Spinner {
	_text: string;

	_spinner: any;

	constructor(text: string) {
		this._text = text;
	}

	start() {
		this._spinner = ora(this._text).start();
	}

	info(text: string) {
		this._spinner.info(text);
	}

	succeed(text: string) {
		this._spinner.succeed(text);
	}

	fail(text: string) {
		this._spinner.fail(text);
	}

	stop() {
		this._spinner.stop();
	}
}

export default Spinner;
