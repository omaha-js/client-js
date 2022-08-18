import { Release } from './Release';
import { ReleaseAttachment } from './ReleaseAttachment';
import { Token } from './Token';

export interface ReleaseDownload {

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

	/**
	 * The token that downloaded this release. This can be `undefined` if the repository is public and it was
	 * downloaded by an unauthenticated user.
	 */
	token?: Token;

}
