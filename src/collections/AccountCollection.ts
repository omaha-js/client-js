import { OmahaCollection } from '../client/OmahaCollection';
import { Account } from '../entities/Account';
import { AccountSettingsRequest } from './account/AccountSettingsRequest';
import { AccountTokensCollection } from './AccountTokensCollection';

export class AccountCollection extends OmahaCollection {

	/**
	 * A collection of endpoints for working with account tokens.
	 */
	public get tokens() {
		return this.client._getCachedCollection(AccountTokensCollection);
	}

	/**
	 * Gets the current settings for the account.
	 * @scope `account.settings.read`
	 */
	public async get() {
		return this.client.get<Account>('/v1/account');
	}

	/**
	 * Gets the current settings for the account.
	 * @scope `account.settings.manage`
	 */
	public async update(options: AccountSettingsRequest) {
		return this.client.patch<Account>('/v1/account', options);
	}

}
