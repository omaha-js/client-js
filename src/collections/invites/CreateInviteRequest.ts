import { CollaborationRole } from '../../entities/enum/CollaborationRole';
import { RepositoryScope } from '../../types/scopes';

export interface CreateInviteRequest {

	/**
	 * The email address to send this invitation to.
	 */
	email: string;

	/**
	 * The role of the new collaborator.
	 */
	role: CollaborationRole;

	/**
	 * The scopes to assign (only when `role` is set to `custom`).
	 */
	scopes?: RepositoryScope[];

}
