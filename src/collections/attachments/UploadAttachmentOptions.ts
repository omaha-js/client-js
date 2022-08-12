import { Readable } from 'stream';

export type UploadAttachmentOptions = (UploadAttachmentFileOptions | UploadAttachmentBufferOptions);

interface BaseAttachmentOptions {

	/**
	 * Optional MD5 checksum of the file to verify integrity of the upload. It is recommended to provide this where
	 * possible. This can be computed automatically when `content` is set to a string file path.
	 */
	hash_md5?: string;

	/**
	 * Optional SHA1 checksum of the file to verify integrity of the upload. It is recommended to provide this where
	 * possible. This can be computed automatically when `content` is set to a string file path.
	 */
	hash_sha1?: string;

	/**
	 * The total size of the file to verify integrity of the upload. It is recommended to provide this where possible.
	 * This can be computed automatically when `content` is set to a string file path.
	 */
	size?: number;

}

export interface UploadAttachmentFileOptions extends BaseAttachmentOptions {

	/**
	 * The file content to upload. Available options:
	 *
	 * - Pass a `File` to upload from the browser.
	 * - Pass a `string` with the path of the file on the disk.
	 * - Pass a `Blob` to stream the file from its source.
	 * - Pass a `Readable` to stream the file from its source.
	 * - Pass a `Buffer` or `ArrayBuffer` to send the file from memory.
	 */
	content: File | string;

	/**
	 * The original name of the file. This is optional when `content` is set to a string file path.
	 */
	name?: string;

}

export interface UploadAttachmentBufferOptions extends BaseAttachmentOptions {

	/**
	 * The file content to upload. Available options:
	 *
	 * - Pass a `File` to upload from the browser.
	 * - Pass a `string` with the path of the file on the disk.
	 * - Pass a `Blob` to stream the file from its source.
	 * - Pass a `Readable` to stream the file from its source.
	 * - Pass a `Buffer` to send the file from memory.
	 */
	content: Buffer | Blob | Readable;

	/**
	 * The original name of the file. This is optional when `content` is set to a string file path.
	 */
	name: string;

}
