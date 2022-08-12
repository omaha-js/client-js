import { Scope } from '../types/scopes';
import { TokenType } from './enum/TokenType';

export interface Token {

	/**
	 * The hexadecimal identifier for this token.
	 */
	id: string;

	/**
	 * The user-provided name of the token.
	 */
	name: string;

	/**
	 * The description of the token.
	 */
	description: string;

	/**
	 * The type of token.
	 */
	type: TokenType;

	/**
	 * The scopes this token grants.
	 */
	scopes: Scope[];

	/**
	 * The date/time at which this token was created.
	 */
	created_at: Date;

	/**
	 * The date/time at which this token was updated.
	 */
	updated_at: Date;

	/**
	 * The date/time at which this token will expire, or `null` if it will never expire.
	 */
	expires_at: Date | null;

}
