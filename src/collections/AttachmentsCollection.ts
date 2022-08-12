import { OmahaCollection } from '../client/OmahaCollection';
import { UploadAttachmentOptions } from './attachments/UploadAttachmentOptions';
import { ReleaseAttachment } from '../entities/ReleaseAttachment';
import { DownloadAttachmentResponse } from './attachments/DownloadAttachmentResponse';
import { Readable } from 'stream';
import FormData from 'form-data';
import type Crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export class AttachmentsCollection extends OmahaCollection {

	/**
	 * Uploads an attachment to the specified release.
	 * @param repo The UUID of the repository.
	 * @param version The version string.
	 * @param asset The name of the asset to upload.
	 * @param options The options for the file to upload.
	 * @scope `repo.releases.attachments.manage`
	 */
	public async upload(repo: string, version: string, asset: string, options: UploadAttachmentOptions) {
		const form = await this.getFormData(options);

		return this.client.post<ReleaseAttachment>(
			this.format('/v1/repositories/:repo/releases/:version/:asset', { repo, version, asset }),
			form
		);
	}

	/**
	 * Gets the `FormData` instance to use for an attachment upload.
	 *
	 * @param options
	 * @returns
	 */
	private async getFormData(options: UploadAttachmentOptions) {
		const form = new FormData();

		if (typeof options.size !== 'undefined') {
			form.append('file_size', Number(options.size));
		}

		if (typeof options.hash_md5 !== 'undefined') {
			form.append('hash_md5', options.hash_md5);
		}

		if (typeof options.hash_sha1 !== 'undefined') {
			form.append('hash_sha1', options.hash_sha1);
		}

		if (typeof options.content === 'string') {
			// Calculate size if needed
			if (typeof options.size === 'undefined') {
				const stat = await fs.promises.stat(options.content);
				form.append('file_size', stat.size);
			}

			if (typeof options.hash_md5 === 'undefined' || typeof options.hash_sha1 === 'undefined') {
				const crypto: typeof Crypto = module[`require`]('crypto');
				const hash_md5 = crypto.createHash('md5', { encoding: 'binary' });
				const hash_sha1 = crypto.createHash('sha1', { encoding: 'binary' });

				await new Promise<void>((resolve, reject) => {
					const stream = fs.createReadStream(options.content as string);

					stream.on('data', (chunk: any) => {
						hash_md5.update(chunk, 'binary');
						hash_sha1.update(chunk, 'binary');
					});

					stream.on('error', err => reject(err));
					stream.on('end', () => resolve());
				});

				if (typeof options.hash_md5 === 'undefined') {
					form.append('hash_md5', hash_md5.digest('hex'));
				}

				if (typeof options.hash_sha1 === 'undefined') {
					form.append('hash_sha1', hash_sha1.digest('hex'));
				}
			}

			form.append(
				'file',
				fs.createReadStream(options.content),
				options.name ?? path.basename(options.content)
			);
		}
		else if (typeof File === 'function' && options.content instanceof File) {
			if (typeof options.size === 'undefined') {
				form.append('file_size', options.content.size);
			}

			form.append('file', options.content, options.content.name);
		}
		else if (this.isDirectSource(options.content)) {
			form.append('file', options.content, options.name);
		}
		else if (this.isStreamSource(options.content)) {
			form.append('file', options.content, options.name);
		}
		else {
			throw new Error('Unknown content format in attachment upload');
		}

		return form;
	}

	/**
	 * Returns true if the given value is one of `Buffer`, or `Blob`.
	 *
	 * @param value
	 * @returns
	 */
	private isDirectSource(value: any) {
		if (typeof Buffer === 'function' && value instanceof Buffer) return true;
		if (typeof Blob === 'function' && value instanceof Blob) return true;

		return false;
	}

	/**
	 * Returns true if the given value is a stream.
	 *
	 * @param value
	 * @returns
	 */
	private isStreamSource(value: any): value is Readable {
		return typeof value === 'object' && typeof value.read === 'function';
	}

	/**
	 * Gets information about an attachment on the release.
	 * @param repo The UUID of the repository.
	 * @param version The version string.
	 * @param asset The name of the asset.
	 */
	public async get(repo: string, version: string, asset: string) {
		return this.client.get<ReleaseAttachment>(
			this.format('/v1/repositories/:repo/releases/:version/:asset', { repo, version, asset }),
		);
	}

	/**
	 * Gets a download link for an attachment on the release.
	 * @param repo The UUID of the repository.
	 * @param version The version string.
	 * @param asset The name of the asset.
	 * @scopes `repo.releases.attachments.download` (only for private repos)
	 */
	public async download(repo: string, version: string, asset: string) {
		return this.client.get<DownloadAttachmentResponse>(
			this.format('/v1/repositories/:repo/releases/:version/:asset/download', { repo, version, asset }),
		);
	}

}

interface Hashes {
	hash_md5: string;
	hash_sha1: string;
}
