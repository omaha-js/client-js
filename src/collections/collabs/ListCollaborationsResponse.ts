import { Collaboration } from '../../entities/Collaboration';
import { CollaborationInvite } from '../../entities/CollaborationInvite';

export interface ListCollaborationsResponse {

	/**
	 * The existing collaborations in the repository.
	 */
	collaborations: Collaboration[];

	/**
	 * The pending collaboration invites for the repository.
	 */
	invites: CollaborationInvite[];

}
