import { OmahaCollection } from '../client/OmahaCollection';
import { GetAccountNotificationsResponse } from './notifications/GetAccountNotificationsResponse';
import { GetRepositoryNotificationsResponse } from './notifications/GetRepositoryNotificationsResponse';
import { UpdateNotificationsRequest } from './notifications/UpdateNotificationsRequest';
import { UpdateRepositoryNotificationsRequest } from './notifications/UpdateRepositoryNotificationsRequest';

export class NotificationsCollection extends OmahaCollection {

	/**
	 * Gets notification statuses for the current account.
	 * @scope `account.notifications.manage`
	 */
	public async getForAccount() {
		return this.client.get<GetAccountNotificationsResponse>('/v1/notifications/account');
	}

	/**
	 * Updates notification statuses for the current account, and returns the new statuses.
	 * @param notifications
	 *   An object whose keys are notification identifiers and whose values are booleans indicating whether or not
	 *   those notifications should be enabled. Any keys that are omitted will not be updated.
	 * @scope `account.notifications.manage`
	 */
	public async updateForAccount(notifications: UpdateNotificationsRequest) {
		return this.client.patch<GetAccountNotificationsResponse>(
			'/v1/notifications/account',
			notifications
		);
	}

	/**
	 * Gets notification statuses for a repository.
	 * @param id The UUID of the repository.
	 * @scope `account.notifications.manage`
	 */
	public async getForRepository(id: string) {
		return this.client.get<GetRepositoryNotificationsResponse>(
			this.format('/v1/notifications/repository/:id', { id })
		);
	}

	/**
	 * Updates notification statuses for a repository, and returns the new statuses.
	 * @param id The UUID of the repository.
	 * @param notifications
	 *   An object whose keys are notification identifiers and whose values are booleans indicating whether or not
	 *   those notifications should be enabled. Any keys that are omitted will not be updated.
	 * @scope `account.notifications.manage`
	 */
	public async updateForRepository(id: string, notifications: UpdateRepositoryNotificationsRequest) {
		return this.client.patch<GetRepositoryNotificationsResponse>(
			this.format('/v1/notifications/repository/:id', { id }),
			notifications
		);
	}

}
