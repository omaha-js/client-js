import { Scope } from '../../../types/scopes';

export interface UpdateAccountTokenRequest {

	/**
	 * The name of the token.
	 */
	name?: string;

	/**
	 * The description of the token.
	 */
	description?: string;

	/**
	 * The scopes this token will grant access to. Note that this overrides the entire scopes array.
	 */
	scopes?: Scope[];

	/**
	 * When set to true, the token will be regenerated and a new access key will be returned. Note that the old key
	 * will stop working.
	 */
	invalidate?: boolean;

}
