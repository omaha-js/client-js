import { CollaborationRole } from '../../entities/enum/CollaborationRole';
import { RepositoryScope } from '../../types/scopes';

export interface UpdateCollaborationRequest {

	/**
	 * The new role to assign. Note that this will automatically change the permission scopes granted on the token,
	 * unless the role is `custom`.
	 */
	role?: CollaborationRole;

	/**
	 * The new scopes to assign. Note that this does not apply unless the role is `custom`.
	 */
	scopes?: RepositoryScope[];

}
