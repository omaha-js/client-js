import { OmahaCollection } from '../client/OmahaCollection';
import { Token } from '../entities/Token';
import { CreateAccountTokenRequest } from './account/tokens/CreateAccountTokenRequest';
import { CreateAccountTokenResponse } from './account/tokens/CreateAccountTokenResponse';
import { UpdateAccountTokenRequest } from './account/tokens/UpdateAccountTokenRequest';
import { UpdateAccountTokenResponse } from './account/tokens/UpdateAccountTokenResponse';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';

export class AccountTokensCollection extends OmahaCollection {

	/**
	 * Lists all tokens that have been generated for the account.
	 * @scope `account.tokens.list`
	 */
	public async list() {
		return this.client.get<Token[]>('/v1/account/tokens');
	}

	/**
	 * Creates a new token for the current account.
	 * @scope `account.tokens.manage`
	 */
	public async create(options: CreateAccountTokenRequest) {
		return this.client.post<CreateAccountTokenResponse>('/v1/account/tokens', options);
	}

	/**
	 * Gets a token for the current account.
	 * @param id The ID of the token to get.
	 * @scope `account.tokens.list`
	 */
	public async get(id: string) {
		return this.client.get<Token>(this.format('/v1/account/tokens/:id', { id }));
	}

	/**
	 * Updates an existing token for the current account.
	 * @param id The ID of the token to update.
	 * @scope `account.tokens.manage`
	 */
	public async update(id: string, options: UpdateAccountTokenRequest) {
		return this.client.patch<UpdateAccountTokenResponse>(
			this.format('/v1/account/tokens/:id', { id }),
			options
		);
	}

	/**
	 * Deletes a token for the current account.
	 * @param id The ID of the token to delete.
	 * @scope `account.tokens.manage`
	 */
	public async delete(id: string) {
		return this.client.delete<DeleteObjectResponse>(this.format('/v1/account/tokens/:id', { id }));
	}

}
