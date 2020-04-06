import ora from 'ora';

class Spinner {
	_text: string;

	_spinner: ora.Ora;

	constructor(text: string) {
		this._text = text;
		this._spinner = ora(this._text);
	}

	start(text?: string): void {
		this._spinner.start(text);
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

	stopAndPersist({ text, symbol, prefixText }: ora.PersistOptions): void {
		this._spinner.stopAndPersist({
			...(text && { text }),
			...(symbol && { symbol }),
			...(prefixText && { prefixText }),
		});
	}
}

export default Spinner;
