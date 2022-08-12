import { OmahaCollection } from '../client/OmahaCollection';
import { UploadAttachmentOptions } from './attachments/UploadAttachmentOptions';
import { ReleaseAttachment } from '../entities/ReleaseAttachment';
import fs from 'fs';
import path from 'path';
import { DownloadAttachmentResponse } from './attachments/DownloadAttachmentResponse';

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
		const form = new FormData();

		if (options.type === 'file') {
			const buffer = await fs.promises.readFile(options.path);
			form.append('file', new Blob([buffer]), path.basename(options.path));
		}
		else if (options.type === 'buffer') {
			form.append('file', new Blob([options.buffer]), options.name);
		}

		return this.client.post<ReleaseAttachment>(
			this.format('/v1/repositories/:repo/releases/:version/:asset', { repo, version, asset }),
			form
		);
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
