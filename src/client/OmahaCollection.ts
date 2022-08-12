import { Omaha } from './Omaha';

export abstract class OmahaCollection {

	public constructor(protected readonly client: Omaha) {

	}

	/**
	 * Formats a path with named parameters, checking to ensure their values are valid before hand.
	 * @param path
	 * @param params
	 * @returns
	 */
	protected format(path: string, params: Record<string, string | number>) {
		for (const key in params) {
			const value = params[key].toString();

			if (!value.match(/^[a-z0-9_\-+.@]+$/i)) {
				throw new Error(`Invalid format for named parameter "${key}"`);
			}

			path = path.replace(':' + key, value);
		}

		return path;
	}

}
