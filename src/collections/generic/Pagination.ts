export interface Pagination {

	/**
	 * The current page number.
	 */
	page: number;

	/**
	 * The total number of pages available.
	 */
	page_count: number;

	/**
	 * The number of results shown per page.
	 */
	page_size: number;

	/**
	 * The total number of results across all pages.
	 */
	num_results: number;

}
