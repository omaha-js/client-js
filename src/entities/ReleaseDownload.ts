import { Release } from './Release';
import { ReleaseAttachment } from './ReleaseAttachment';

export interface ReleaseDownload {

	/**
	 * The unique ID for the download record.
	 */
	id: number;

	/**
	 * The IP address of the downloader.
	 */
	ip: string;

	/**
	 * The date/time at which the download occurred.
	 */
	time: Date;

	/**
	 * The release that was downloaded.
	 */
	release: Release;

	/**
	 * The attachment that was downloaded.
	 */
	attachment: ReleaseAttachment;

}
