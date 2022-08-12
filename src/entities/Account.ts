export interface Account {

	/**
	 * The name of the account.
	 */
	name: string;

	/**
	 * The email address of the account.
	 */
	email: string;

	/**
	 * Whether or not this account's email address has been verified.
	 */
	verified: boolean;

	/**
	 * The date/time at which the account was created.
	 */
	created_at: Date;

	/**
	 * The date/time at which the account was last updated.
	 */
	updated_at: Date;

}
