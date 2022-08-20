import { NotificationId } from '../../types/notifications';

export interface GetRepositoryNotificationsResponse {

	/**
	 * An array of all notifications in the system and their current status on both the account and the repository.
	 */
	notifications: {

		/**
		 * The notification identifier.
		 */
		id: NotificationId;

		/**
		 * The user-friendly description of the notification.
		 */
		description: string;

		/**
		 * A boolean indicating whether the notification is enabled for this account.
		 */
		account_enabled: boolean;

		/**
		 * A boolean indicating whether the notification is enabled for this repository.
		 */
		enabled: boolean;

	}[];

}
