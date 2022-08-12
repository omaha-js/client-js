/**
 * The names of the scopes that grant access to account features.
 */
export type AccountScope = (
	'account.settings.read' |
	'account.settings.manage' |
	'account.tokens.list' |
	'account.tokens.manage' |
	'account.repos.manage'
);

/**
 * The names of the scopes that grant access to repository features.
 */
export type RepositoryScope = (
	'repo.manage' |
	'repo.tokens.list' |
	'repo.tokens.manage' |
	'repo.collaborations.list' |
	'repo.collaborations.manage' |
	'repo.releases.create' |
	'repo.releases.edit' |
	'repo.releases.attachments.manage' |
	'repo.releases.attachments.download' |
	'repo.tags.manage' |
	'repo.assets.manage' |
	'repo.audit.downloads'
);

/**
 * The names of all scopes in the omaha system.
 */
export type Scope = AccountScope | RepositoryScope;
