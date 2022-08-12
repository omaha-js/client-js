import { OmahaCollection } from '../client/OmahaCollection';
import { Collaboration } from '../entities/Collaboration';
import { ListCollaborationsResponse } from './collabs/ListCollaborationsResponse';
import { UpdateCollaborationRequest } from './collabs/UpdateCollaborationRequest';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';

export class CollabsCollection extends OmahaCollection {

	/**
	 * Lists all collaborations in a repository.
	 * @param repo The UUID of the repository.
	 * @scope `repo.collaborations.list`
	 */
	public async list(repo: string) {
		return this.client.get<ListCollaborationsResponse>(
			this.format('/v1/repositories/:repo/collaborations', { repo })
		);
	}

	/**
	 * Gets a specific collaboration in the repository.
	 * @param repo The UUID of the repository.
	 * @param collab The UUID of the collaboration.
	 * @scope `repo.collaborations.list`
	 */
	public async get(repo: string, collab: string) {
		return this.client.get<Collaboration>(
			this.format('/v1/repositories/:repo/collaborations/:collab', { repo, collab })
		);
	}

	/**
	 * Updates a collaboration in the repository.
	 * @param repo The UUID of the repository.
	 * @param collab The UUID of the collaboration.
	 * @param options The new options to set.
	 * @scope `repo.collaborations.manage`
	 */
	public async update(repo: string, collab: string, options: UpdateCollaborationRequest) {
		return this.client.patch<Collaboration>(
			this.format('/v1/repositories/:repo/collaborations/:collab', { repo, collab }),
			options
		);
	}

	/**
	 * Deletes a collaboration in the repository.
	 * @param repo The UUID of the repository.
	 * @param collab The UUID of the collaboration.
	 * @scope `repo.collaborations.manage`
	 */
	public async delete(repo: string, collab: string) {
		return this.client.delete<DeleteObjectResponse>(
			this.format('/v1/repositories/:repo/collaborations/:collab', { repo, collab })
		);
	}

}
