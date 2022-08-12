import { Token } from '../../../entities/Token';

export interface UpdateRepositoryTokenResponse {

	/**
	 * The authentication key for this token if `invalidate` was set to true in the request. Otherwise, this will be
	 * `undefined` and the existing key will remain valid.
	 */
	key?: string;

	/**
	 * The resulting token that was created.
	 */
	token: Token;

}
