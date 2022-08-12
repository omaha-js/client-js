import { OmahaCollection } from '../client/OmahaCollection';
import { Token } from '../entities/Token';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';
import { CreateRepositoryTokenRequest } from './repository/tokens/CreateRepositoryTokenRequest';
import { CreateRepositoryTokenResponse } from './repository/tokens/CreateRepositoryTokenResponse';
import { UpdateRepositoryTokenRequest } from './repository/tokens/UpdateRepositoryTokenRequest';
import { UpdateRepositoryTokenResponse } from './repository/tokens/UpdateRepositoryTokenResponse';

export class RepositoryTokensCollection extends OmahaCollection {

	/**
	 * Lists all tokens that have been generated for the repository.
	 * @param repo The UUID of the repository.
	 * @scope `repo.tokens.list`
	 */
	public async list(repo: string) {
		return this.client.get<Token[]>(
			this.format('/v1/repositories/:repo/tokens', { repo })
		);
	}

	/**
	 * Creates a new token for the repository.
	 * @param repo The UUID of the repository.
	 * @param options The options for the token.
	 * @scope `repo.tokens.manage`
	 */
	public async create(repo: string, options: CreateRepositoryTokenRequest) {
		return this.client.post<CreateRepositoryTokenResponse>(
			this.format('/v1/repositories/:repo/tokens', { repo }),
			options
		);
	}

	/**
	 * Gets a token for the current repository.
	 * @param repo The UUID of the repository.
	 * @param id The ID of the token to get.
	 * @scope `repo.tokens.list`
	 */
	public async get(repo: string, id: string) {
		return this.client.get<Token>(
			this.format('/v1/repositories/:repo/tokens/:id', { repo, id }),
		);
	}

	/**
	 * Updates an existing token for the repository.
	 * @param repo The UUID of the repository.
	 * @param id The ID of the token to update.
	 * @param options The options for the token.
	 * @scope `repo.tokens.manage`
	 */
	public async update(repo: string, id: string, options: UpdateRepositoryTokenRequest) {
		return this.client.patch<UpdateRepositoryTokenResponse>(
			this.format('/v1/repositories/:repo/tokens/:id', { repo, id }),
			options
		);
	}

	/**
	 * Deletes a token for the repository.
	 * @param repo The UUID of the repository.
	 * @param id The ID of the token to delete.
	 * @scope `repo.tokens.manage`
	 */
	public async delete(repo: string, id: string) {
		return this.client.delete<DeleteObjectResponse>(
			this.format('/v1/repositories/:repo/tokens/:id', { repo, id })
		);
	}

}
