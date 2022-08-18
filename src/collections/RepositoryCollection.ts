import { OmahaCollection } from '../client/OmahaCollection';
import { Repository } from '../entities/Repository';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';
import { CreateRepositoryRequest } from './repository/CreateRepositoryRequest';
import { RepositoryWithCollaboration } from './repository/RepositoryWithCollaboration';
import { UpdateRepositoryRequest } from './repository/UpdateRepositoryRequest';
import { RepositoryTokensCollection } from './RepositoryTokensCollection';

export class RepositoryCollection extends OmahaCollection {

	/**
	 * A collection of endpoints for working with repository tokens.
	 */
	public get tokens() {
		return this.client._getCachedCollection(RepositoryTokensCollection);
	}

	/**
	 * Gets a list of all repositories that the current token has access to.
	 */
	public async list() {
		return this.client.get<RepositoryWithCollaboration[]>('/v1/repositories');
	}

	/**
	 * Gets a specific repository that the current token has access to.
	 */
	public async get(id: string) {
		return this.client.get<Repository>(this.format('/v1/repositories/:id', { id }));
	}

	/**
	 * Gets an array of all version strings in the repository, sorted by version number in descending order.
	 */
	public async versions(id: string) {
		return this.client.get<string[]>(this.format('/v1/repositories/:id/versions', { id }));
	}

	/**
	 * Creates a new repository for the current account.
	 * @scope `account.repos.manage`
	 */
	public async create(options: CreateRepositoryRequest) {
		return this.client.post<RepositoryWithCollaboration>('/v1/repositories', options);
	}

	/**
	 * Creates a new repository for the current account.
	 * @scope `repo.manage`
	 */
	public async update(id: string, options: UpdateRepositoryRequest) {
		return this.client.patch<Repository>(
			this.format('/v1/repositories/:id', { id }),
			options
		);
	}

	/**
	 * Deletes a repository. The repository will disappear from all endpoints, and an email will be sent to the owners
	 * with a link that can restore it within 7 days, after which it will be permanently deleted.
	 * @scope `account.repos.manage`
	 * @note The current token must have 'owner' level access to the repository.
	 */
	public async delete(id: string) {
		return this.client.delete<DeleteObjectResponse>(this.format('/v1/repositories/:id', { id }));
	}

	/**
	 * Gets information about a deleted repository (only while within the grace period).
	 * @scope `account.repos.manage`
	 * @note The current token must have 'owner' level access to the repository.
	 */
	public async getDeleted(id: string) {
		return this.client.get<Repository>(this.format('/v1/repositories/restore/:id', { id }));
	}

	/**
	 * Restores a deleted repository.
	 * @scope `account.repos.manage`
	 * @note The current token must have 'owner' level access to the repository.
	 */
	public async restore(id: string) {
		return this.client.patch<DeleteObjectResponse>(this.format('/v1/repositories/restore/:id', { id }));
	}

}
