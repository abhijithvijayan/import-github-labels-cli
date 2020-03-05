import ora from 'ora';

class Spinner {
	_text: string;

	_spinner: ora.Ora;

	constructor(text: string) {
		this._text = text;
		this._spinner = ora(this._text);
	}

	start(): void {
		this._spinner.start();
	}

	info(text: string): void {
		this._spinner.info(text);
	}

	succeed(text: string): void {
		this._spinner.succeed(text);
	}

	fail(text: string): void {
		this._spinner.fail(text);
	}

	stop(): void {
		this._spinner.stop();
	}
}

export default Spinner;
