import { NotificationId } from '../../types/notifications';

export type UpdateNotificationsRequest = {
	[key in NotificationId]?: boolean;
}
