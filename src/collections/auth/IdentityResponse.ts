import { Account } from '../../entities/Account';
import { Scope } from '../../types/scopes';

export type IdentityResponse = (
	UnauthenticatedIdentityResponse |
	AccountIdentityResponse |
	RepositoryIdentityResponse
);

export interface UnauthenticatedIdentityResponse {

	/**
	 * The type of access that the current bearer token grants.
	 */
	access: 'unauthenticated';

	/**
	 * An array of all scopes granted by the current bearer token.
	 */
	scopes: Scope[];
}

export interface AccountIdentityResponse {

	/**
	 * The type of access that the current access token grants.
	 */
	access: 'account';

	/**
	 * An array of all scopes granted by the current access token.
	 */
	scopes: Scope[];

	/**
	 * The number of seconds remaining until the access token expires.
	 */
	ttl: number;

	/**
	 * The account that the token grants access to.
	 */
	account: Account;

}

export interface RepositoryIdentityResponse {

	/**
	 * The type of access that the current access token grants.
	 */
	access: 'repository';

	/**
	 * An array of all scopes granted by the current access token.
	 */
	scopes: Scope[];

	/**
	 * The number of seconds remaining until the access token expires.
	 */
	ttl: number;

}
