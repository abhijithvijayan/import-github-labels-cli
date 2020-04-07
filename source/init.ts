import updateNotifier from 'update-notifier';

import pkgJSON from '../package.json';

export default (): void => {
	updateNotifier({
		pkg: pkgJSON,
		shouldNotifyInNpmScript: true,
		updateCheckInterval: 1000 * 60 * 60 * 24,
	}).notify({
		isGlobal: true,
	});
};
