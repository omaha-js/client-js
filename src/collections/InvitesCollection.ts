import { OmahaCollection } from '../client/OmahaCollection';
import { CollaborationInvite } from '../entities/CollaborationInvite';
import { AcceptInvitationResponse } from './account/AcceptInvitationResponse';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';
import { CreateInviteRequest } from './invites/CreateInviteRequest';
import { UpdateInviteRequest } from './invites/UpdateInviteRequest';

export class InvitesCollection extends OmahaCollection {

	/**
	 * Gets details about an invitation to collaborate on a repository. This is performed from an account's perspective,
	 * so the account must be eligible to join the target repository.
	 * @param id The UUID of the invitation.
	 * @scope `account.repos.manage`
	 */
	public async getForAccount(id: string) {
		return this.client.get<CollaborationInvite>(
			this.format('/v1/account/accept_invitation/:id', { id })
		)
	}

	/**
	 * Gets details about an invitation to collaborate on a repository.
	 * @param repo The UUID of the repository.
	 * @param id The UUID of the invitation.
	 * @scopes `repo.collaborations.list`
	 */
	public async get(repo: string, id: string) {
		return this.client.get<CollaborationInvite>(
			this.format('/v1/repositories/:repo/collaborations/invites/:id', { repo, id })
		)
	}

	/**
	 * Accepts an invitation to collaborate on a repository.
	 * @param id The UUID of the invitation to accept.
	 * @scope `account.repos.manage`
	 */
	public async accept(id: string) {
		return this.client.post<AcceptInvitationResponse>(this.format(
			'/v1/account/accept_invitation/:id',
			{ id }
		));
	}

	/**
	 * Creates a new invitation to collaborate on a repository.
	 * @param repo The UUID of the repository.
	 * @param options The options for the new invitation.
	 * @scope `repo.collaborations.manage`
	 */
	public async create(repo: string, options: CreateInviteRequest) {
		return this.client.post<CollaborationInvite>(
			this.format('/v1/repositories/:repo/collaborations', { repo }),
			options
		)
	}

	/**
	 * Updates an existing invitation to collaborate on a repository.
	 * @param repo The UUID of the repository.
	 * @param repo The UUID of the invitation.
	 * @param options The new options for the invitation.
	 * @scope `repo.collaborations.manage`
	 */
	public async update(repo: string, id: string, options: UpdateInviteRequest) {
		return this.client.patch<CollaborationInvite>(
			this.format('/v1/repositories/:repo/collaborations/invites/:id', { repo, id }),
			options
		)
	}

	/**
	 * Deletes an invitation to collaborate on a repository.
	 * @param repo The UUID of the repository.
	 * @param id The UUID of the invitation.
	 * @scopes `repo.collaborations.manage`
	 */
	public async delete(repo: string, id: string) {
		return this.client.delete<DeleteObjectResponse>(
			this.format('/v1/repositories/:repo/collaborations/invites/:id', { repo, id })
		)
	}

}
