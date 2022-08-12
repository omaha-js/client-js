export interface CreateReleaseRequest {

	/**
	 * The version of the new release.
	 */
	version: string;

	/**
	 * The description of the new release (e.g. release notes and/or changelog).
	 */
	description?: string;

	/**
	 * The tags for this release.
	 */
	tags: string[];

}
