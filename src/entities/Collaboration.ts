import { RepositoryScope } from '../types/scopes';
import { Account } from './Account';
import { CollaborationRole } from './enum/CollaborationRole';
import { Repository } from './Repository';

export interface Collaboration {

	/**
	 * The UUID of the collaboration.
	 */
	id: string;

	/**
	 * The account who this collaboration belongs to. This may be `undefined` for endpoints where the account is
	 * already known.
	 */
	account?: Account;

	/**
	 * The repository this collaboration grants access to. This may be `undefined` for endpoints where the repository
	 * is already known.
	 */
	repository?: Repository;

	/**
	 * The assigned role of this collaboration.
	 */
	role: CollaborationRole;

	/**
	 * The scopes this collaboration grants.
	 */
	scopes: RepositoryScope[];

	/**
	 * The date/time at which the collaboration was created.
	 */
	created_at: Date;

	/**
	 * The date/time at which the collaboration was last updated.
	 */
	updated_at: Date;

	/**
	 * The date/time at which this collaboration was deleted. If not deleted, this will be excluded and/or `undefined`.
	 * Note that deleted collaborations only appear in logs.
	 */
	deleted_at?: Date;

}
