import { OmahaCollection } from '../client/OmahaCollection';
import { ReleaseStatus } from '../entities/enum/ReleaseStatus';
import { Release } from '../entities/Release';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';
import { CreateReleaseRequest } from './releases/CreateReleaseRequest';
import { ReleaseSearchRequest } from './releases/ReleaseSearchRequest';
import { ReleaseSearchResponse } from './releases/ReleaseSearchResponse';
import { UpdateReleaseRequest } from './releases/UpdateReleaseRequest';

export class ReleasesCollection extends OmahaCollection {

	/**
	 * Searches for releases in the repository.
	 * @param repo The UUID of the repository.
	 * @param options The search options.
	 */
	public async search(repo: string, options: ReleaseSearchRequest = {}) {
		return this.client.get<ReleaseSearchResponse>(
			this.format('/v1/repositories/:repo/releases', { repo }),
			options
		);
	}

	/**
	 * Creates a new release in the repository.
	 * @param repo The UUID of the repository.
	 * @param options The release options.
	 * @scope `repo.releases.create`
	 */
	public async create(repo: string, options: CreateReleaseRequest) {
		return this.client.post<Release>(
			this.format('/v1/repositories/:repo/releases', { repo }),
			options
		);
	}

	/**
	 * Gets details about a release in the repository.
	 * @param repo The UUID of the repository.
	 * @param version The version string to get.
	 */
	public async get(repo: string, version: string) {
		return this.client.get<Release>(
			this.format('/v1/repositories/:repo/releases/:version', { repo, version })
		);
	}

	/**
	 * Updates an existing release in the repository.
	 * @param repo The UUID of the repository.
	 * @param version The version string to update.
	 * @param options The release options.
	 * @scope `repo.releases.create` for drafts and `repo.releases.edit` for published/archived
	 */
	public async update(repo: string, version: string, options: UpdateReleaseRequest) {
		return this.client.patch<Release>(
			this.format('/v1/repositories/:repo/releases/:version', { repo, version }),
			options
		);
	}

	/**
	 * Publishes a release in the repository.
	 * @param repo The UUID of the repository.
	 * @param version The version string to update.
	 * @scope `repo.releases.create`
	 */
	public async publish(repo: string, version: string) {
		return this.update(repo, version, {
			status: ReleaseStatus.Published
		});
	}

	/**
	 * Archives a release in the repository.
	 * @param repo The UUID of the repository.
	 * @param version The version string to update.
	 * @scope `repo.releases.edit`
	 */
	public async archive(repo: string, version: string) {
		return this.update(repo, version, {
			status: ReleaseStatus.Archived
		});
	}

	/**
	 * Deletes a release from the repository.
	 * @param repo The UUID of the repository.
	 * @param version The version string to delete.
	 */
	public async delete(repo: string, version: string) {
		return this.client.delete<DeleteObjectResponse>(
			this.format('/v1/repositories/:repo/releases/:version', { repo, version })
		);
	}

}
