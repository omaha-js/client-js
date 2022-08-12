export type UploadAttachmentOptions = (
	UploadAttachmentFileOptions |
	UploadAttachmentBufferOptions
);

export interface UploadAttachmentFileOptions {

	/**
	 * Uploads the attachment from a file path on the local disk.
	 */
	type: 'file';

	/**
	 * The name of the file that we're uploading. If not specified, it is inferred from the path.
	 */
	name?: string;

	/**
	 * The path to the file for reading.
	 */
	path: string;

}

export interface UploadAttachmentBufferOptions {

	/**
	 * Uploads the attachment using a buffer or blob.
	 */
	type: 'buffer';

	/**
	 * The name of the file that we're uploading.
	 */
	name: string;

	/**
	 * The contents of the file as a buffer.
	 */
	buffer: Buffer | Blob | ArrayBuffer;

}
