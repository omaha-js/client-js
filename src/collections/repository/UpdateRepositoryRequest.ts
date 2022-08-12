import { RepositoryAccessType } from '../../entities/enum/RepositoryAccessType';
import { RepositoryVersionScheme } from '../../entities/enum/RepositoryVersionScheme';

export interface UpdateRepositoryRequest {

	/**
	 * The name of the repository.
	 */
	name?: string;

	/**
	 * The description of the repository.
	 */
	description?: string;

	/**
	 * The version scheme to use for releases within the repository.
	 */
	scheme?: RepositoryVersionScheme;

	/**
	 * The access type for the repository.
	 */
	access?: RepositoryAccessType;

	/**
	 * An optional object to override default settings for the repository.
	 */
	settings?: Record<string, any>;

}
