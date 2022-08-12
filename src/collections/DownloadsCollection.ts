import { OmahaCollection } from '../client/OmahaCollection';
import { AttachmentDownloadHistory } from './downloads/AttachmentDownloadHistory';
import { AttachmentDownloadLogs } from './downloads/AttachmentDownloadLogs';
import { DownloadLogsRequest } from './downloads/DownloadLogsRequest';
import { ReleaseDownloadHistory } from './downloads/ReleaseDownloadHistory';
import { ReleaseDownloadLogs } from './downloads/ReleaseDownloadLogs';
import { RepositoryDownloadHistory } from './downloads/RepositoryDownloadHistory';
import { RepositoryDownloadLogs } from './downloads/RepositoryDownloadLogs';

export class DownloadsCollection extends OmahaCollection {

	/**
	 * Gets the weekly download history of a repository.
	 * @param repo The UUID of the repository.
	 */
	public async history(repo: string): Promise<RepositoryDownloadHistory>;

	/**
	 * Gets the weekly download history of a release.
	 * @param repo The UUID of the repository.
	 * @param version The version to check.
	 */
	public async history(repo: string, version: string): Promise<ReleaseDownloadHistory>;

	/**
	 * Gets the weekly download history of a release attachment.
	 * @param repo The UUID of the repository.
	 * @param version The version to check.
	 * @param attachment The name of the attachment to check.
	 */
	public async history(repo: string, version: string, attachment: string): Promise<AttachmentDownloadHistory>;
	public async history(repo: string, version?: string, attachment?: string) {
		if (typeof attachment === 'string' && typeof version === 'string') {
			return this.client.get(
				this.format(
					'/v1/repositories/:repo/downloads/history/:version/:attachment',
					{ repo, version, attachment }
				)
			);
		}
		else if (typeof version === 'string') {
			return this.client.get(this.format('/v1/repositories/:repo/downloads/history/:version', { repo, version }));
		}
		else {
			return this.client.get(this.format('/v1/repositories/:repo/downloads/history', { repo }));
		}
	}

	/**
	 * Gets the download logs for a repository.
	 * @param repo The UUID of the repository.
	 * @param options An options object used to paginate.
	 * @scope `repo.audit.downloads`
	 */
	public async logs(repo: string, options?: DownloadLogsRequest): Promise<RepositoryDownloadLogs>;

	/**
	 * Gets the download logs for a release.
	 * @param repo The UUID of the repository.
	 * @param version The version to check.
	 * @param options An options object used to paginate.
	 * @scope `repo.audit.downloads`
	 */
	public async logs(repo: string, version: string, options?: DownloadLogsRequest): Promise<ReleaseDownloadLogs>;

	/**
	 * Gets the download logs for a release attachment.
	 * @param repo The UUID of the repository.
	 * @param version The version to check.
	 * @param attachment The name of the attachment to check.
	 * @param options An options object used to paginate.
	 * @scope `repo.audit.downloads`
	 */
	public async logs(repo: string, version: string, attachment: string, options?: DownloadLogsRequest): Promise<AttachmentDownloadLogs>;
	public async logs(...args: any[]) {
		if (typeof args[2] === 'string') {
			return this.client.get(
				this.format(
					'/v1/repositories/:repo/downloads/logs/:version/:attachment',
					{ repo: args[0], version: args[1], attachment: args[2] }
				), args[3]
			);
		}
		else if (typeof args[1] === 'string') {
			return this.client.get(
				this.format('/v1/repositories/:repo/downloads/logs/:version', { repo: args[0], version: args[1] }),
				args[2]
			);
		}
		else if (typeof args[0] === 'string') {
			return this.client.get(
				this.format('/v1/repositories/:repo/downloads/logs', { repo: args[0] }),
				args[1]
			);
		}
	}

}
