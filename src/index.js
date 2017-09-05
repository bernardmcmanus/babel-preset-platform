import 'core-js/es7/object';

import once from 'lodash.once';
import merge from 'lodash.mergewith';
import { bgYellow } from 'colors/safe';

import pkg from '../package.json';

function warn(message) {
	// eslint-disable-next-line no-console
	console.log(`${bgYellow.black(' warn ')}[${pkg.name}] ${message}`);
}

const logPlatformWarning = once(() => {
	warn('Target platform was not specified');
	warn('Ensure that the BABEL_PLATFORM env variable is available to your build script');
});

function parseItem(value) {
	return Array.isArray(value)
		? { name: value[0], options: value[1] || null }
		: { name: value, options: null }
}

function unique(array) {
	return array.filter((value, i) => (
		array.indexOf(value) === i
	));
}

module.exports = (context, config = {}) => {
	const platform = process.env.BABEL_PLATFORM || '';
	const registry = { presets: {}, plugins: {} };

	if (!platform) {
		logPlatformWarning();
	}

	Object.entries(config).forEach(([key, value]) => {
		if (key === '*' || platform.includes(key)) {
			Object.entries(registry).forEach(([type, store]) => {
				if (value[type]) {
					value[type].forEach((item) => {
						const { name, options } = parseItem(item);
						if (store[name] === undefined) {
							// only set if undefined to maintain insertion order
							store[name] = options;
						} else if (options) {
							merge(store[name], options, (current, next) => (
								(Array.isArray(current) || Array.isArray(next))
									? unique([].concat(current, next))
									: undefined
							));
						}
					});
				}
			});
		}
	});

	return Object.entries(registry).reduce((acc, [key, value]) => ({
		...acc, [key]: Object.entries(value).map(([name, opts]) => (
			[name, opts].filter(Boolean)
		))
	}), {});
};
