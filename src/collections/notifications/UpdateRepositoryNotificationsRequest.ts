import { RepoNotificationId } from '../../types/notifications';

export type UpdateRepositoryNotificationsRequest = {
	[key in RepoNotificationId]?: boolean;
}
