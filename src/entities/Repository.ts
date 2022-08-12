import { Asset } from './Asset';
import { RepositoryAccessType } from './enum/RepositoryAccessType';
import { RepositoryVersionScheme } from './enum/RepositoryVersionScheme';
import { Tag } from './Tag';

export interface Repository {

	/**
	 * The UUID of the repository.
	 */
	id: string;

	/**
	 * The name of the repository.
	 */
	name: string;

	/**
	 * The description of the repository.
	 */
	description: string;

	/**
	 * The version scheme used by this repository.
	 */
	scheme: RepositoryVersionScheme;

	/**
	 * The type of access for this repository.
	 */
	access: RepositoryAccessType;

	/**
	 * The full settings for this repository.
	 */
	settings: Record<string, any>;

	/**
	 * The date/time at which this repository was created.
	 */
	created_at: Date;

	/**
	 * The date/time at which this repository was last updated.
	 */
	updated_at: Date;

	/**
	 * The tags for this repository. This is only available for certain endpoints.
	 */
	tags?: Tag[];

	/**
	 * The assets for this repository. This is only available for certain endpoints.
	 */
	assets?: Asset[];

}
