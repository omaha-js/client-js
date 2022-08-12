import { CollaborationRole } from '../../entities/enum/CollaborationRole';
import { RepositoryScope } from '../../types/scopes';

export interface UpdateInviteRequest {

	/**
	 * The new role of the new collaborator.
	 */
	role?: CollaborationRole;

	/**
	 * The scopes to assign (only when `role` is set to `custom`).
	 */
	scopes?: RepositoryScope[];

}
