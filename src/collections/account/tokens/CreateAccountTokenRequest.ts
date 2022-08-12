import { Scope } from '../../../types/scopes';

export interface CreateAccountTokenRequest {

	/**
	 * The name of the token.
	 */
	name: string;

	/**
	 * The description of the token.
	 */
	description?: string;

	/**
	 * The number of milliseconds until the token expires (or `0` to never expire).
	 */
	expiration: number;

	/**
	 * The scopes this token will grant access to. Note that scopes are limited to what the current session has access
	 * to, and any others will be ignored.
	 */
	scopes: Scope[];

}
