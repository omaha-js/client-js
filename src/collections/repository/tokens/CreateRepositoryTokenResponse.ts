import { Token } from '../../../entities/Token';

export interface CreateRepositoryTokenResponse {

	/**
	 * The authentication key for this token. This key is not stored on the server and will not be made available
	 * again, so keep it safe.
	 */
	key: string;

	/**
	 * The resulting token that was created.
	 */
	token: Token;

}
