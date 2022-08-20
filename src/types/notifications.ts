/**
 * The identifiers for repository notifications.
 */
export type RepoNotificationId = (
	'repo_release_published' |
	'repo_collab_invite' |
	'repo_collab_accepted' |
	'repo_collab_removed' |
	'repo_token_created' |
	'repo_token_deleted' |
	'repo_visibility_updated'
)

/**
 * The identifiers for account notifications.
 */
export type AccountNotificationId = (
	'account_token_created' |
	'account_token_deleted'
)

/**
 * The identifiers for all notifications.
 */
export type NotificationId = RepoNotificationId | AccountNotificationId;
