export interface RegisterRequest {

	/**
	 * The name of the user.
	 */
	name: string;

	/**
	 * The email address of the user.
	 */
	email: string;

	/**
	 * The plaintext password of the user.
	 */
	password: string;

	/**
	 * The UUID of an invitation if applicable. The new account will automatically accept the invitation and join the
	 * underlying repository as a collaborator.
	 */
	invitation?: string;

	/**
	 * The token for the invitation (optional). When provided, it can be used to automatically verify the new account's
	 * email address if it matches the invitation. This token is only found in the link sent in the invitation email.
	 */
	invitationToken?: string;

}
