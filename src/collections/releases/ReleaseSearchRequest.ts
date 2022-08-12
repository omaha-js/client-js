import { ReleaseStatus } from '../../entities/enum/ReleaseStatus';

export interface ReleaseSearchRequest {

	/**
	 * The page number of results to show.
	 * @default '1'
	 */
	page?: string | number;

	/**
	 * The number of results to show per page. This can be set to `0` to show all results when `assets=1`.
	 * @default '25'
	 */
	count?: string | number;

	/**
	 * Whether or not to include attachments in the results.
	 * @default 'false'
	 */
	include_attachments?: string | boolean;

	/**
	 * Whether or not to include 7-day download statistics in the results.
	 * @default '0'
	 */
	include_downloads?: string | boolean;

	/**
	 * Search for a version. This can be an exact version number, a version constraint (based on the driver used for
	 * the repository), or tag name, and is checked in that order.
	 * @default undefined
	 */
	constraint?: string;

	/**
	 * A comma-delimited list of release tags to include. When not specified or blank, all tags are included.
	 * @default '' // (all)
	 */
	tags?: string | string[];

	/**
	 * A comma-delimited list of assets to look for. When multiple assets are defined, releases that match any of them
	 * will be included in the results.
	 * @default '' // (all)
	 */
	assets?: string | string[];

	/**
	 * The sorting algorithm to use for results.
	 * @default 'version'
	 */
	sort?: 'version' | 'date';

	/**
	 * The direction to use for the sorting algorithm.
	 * @default 'desc'
	 */
	sort_order?: 'desc' | 'asc';

	/**
	 * A comma-delimited list of release statuses to include in the search.
	 * @default 'published'
	 */
	status?: string | ReleaseStatus[];

}
