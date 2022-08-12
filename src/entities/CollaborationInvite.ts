import { RepositoryScope } from '../types/scopes';
import { CollaborationRole } from './enum/CollaborationRole';
import { Repository } from './Repository';

export interface CollaborationInvite {

	/**
	 * The UUID of the invitation that can be used to accept it.
	 */
	id: string;

	/**
	 * The email address this invitation was sent to.
	 */
	email: string;

	/**
	 * The role that will be used in the new collaboration.
	 */
	role: CollaborationRole;

	/**
	 * The custom scopes that will be granted in the new collaboration.
	 */
	scopes: RepositoryScope[];

	/**
	 * The date/time at which this invite was created.
	 */
	created_at: Date;

	/**
	 * The date/time at which this invite will expire.
	 */
	expires_at: Date;

	/**
	 * The repository this invite grants access to (only available for certain endpoints).
	 */
	repository?: Repository;

}
