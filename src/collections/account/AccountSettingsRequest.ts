export interface AccountSettingsRequest {

	/**
	 * The new name to set on the account.
	 */
	name?: string;

	/**
	 * The new email address to set on the account.
	 */
	email?: string;

	/**
	 * The new password to set on the account.
	 */
	password?: string;

	/**
	 * The current password for the account – required when changing email or password.
	 */
	existingPassword?: string;

}
