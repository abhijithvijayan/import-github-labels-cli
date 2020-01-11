import { options } from '../cli';

export interface CliFlags {
	version?: boolean;
	v?: boolean;
}

const validateArguments: any = (_options: CliFlags) => {
	if (
		Object.prototype.hasOwnProperty.call(_options, 'version') ||
		Object.prototype.hasOwnProperty.call(_options, 'v')
	) {
		options.version = _options.version || _options.v;
	}

	// for some condition throw error
	// return new Error('This is an error');

	return null;
};

export default validateArguments;
