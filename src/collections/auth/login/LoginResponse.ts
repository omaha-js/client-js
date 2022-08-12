import { Account } from '../../../entities/Account';

export interface LoginResponse {

	/**
	 * The bearer token to use for authentication.
	 */
	token: string;

	/**
	 * The details of the account that was logged into.
	 */
	account: Account;

}
