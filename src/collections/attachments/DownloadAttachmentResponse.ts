export interface DownloadAttachmentResponse {

	/**
	 * The original name of the file.
	 */
	file_name: string;

	/**
	 * The mime of the file as it was uploaded, such as `application/zip`.
	 */
	mime: string;

	/**
	 * The size of the file in bytes.
	 */
	size: number;

	/**
	 * The hash of the file (SHA-1).
	 */
	hash_sha1: string;

	/**
	 * The hash of the file (MD5).
	 */
	hash_md5: string;

	/**
	 * The temporary link to download this file.
	 */
	download_url: string;

	/**
	 * The number of milliseconds until this download link expires.
	 */
	expires_in: number;

}
