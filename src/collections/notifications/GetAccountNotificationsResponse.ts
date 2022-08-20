import { NotificationId } from '../../types/notifications';

export interface GetAccountNotificationsResponse {

	/**
	 * An array of all notifications in the system and their current status on the account.
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
		enabled: boolean;

	}[];

}
