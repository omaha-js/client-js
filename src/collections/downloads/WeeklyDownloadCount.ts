export interface WeeklyDownloadCount {
	/**
	 * The start of the week.
	 */
	date_start: Date;

	/**
	 * The end of the week.
	 */
	date_end: Date;

	/**
	 * The number of downloads during the week.
	 */
	downloads: number;
}
