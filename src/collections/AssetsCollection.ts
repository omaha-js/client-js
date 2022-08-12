import { OmahaCollection } from '../client/OmahaCollection';
import { Asset } from '../entities/Asset';
import { CreateAssetRequest } from './assets/CreateAssetRequest';
import { UpdateAssetRequest } from './assets/UpdateAssetRequest';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';

export class AssetsCollection extends OmahaCollection {

	/**
	 * Gets a list of all assets in the repository.
	 * @param repo The UUID of the repository.
	 */
	 public async list(repo: string) {
		return this.client.get<Asset[]>(
			this.format('/v1/repositories/:repo/assets', { repo })
		);
	}

	/**
	 * Gets a specific asset in the repository.
	 * @param repo The UUID of the repository.
	 * @param name The name of the asset.
	 */
	public async get(repo: string, name: string) {
		return this.client.get<Asset>(
			this.format('/v1/repositories/:repo/assets/:name', { repo, name })
		);
	}

	/**
	 * Creates a new asset in the repository.
	 * @param repo The UUID of the repository.
	 * @param options The options for the new asset.
	 * @scope `repo.assets.manage`
	 */
	public async create(repo: string, options: CreateAssetRequest) {
		return this.client.post<Asset>(
			this.format('/v1/repositories/:repo/assets', { repo }),
			options
		);
	}

	/**
	 * Updates an existing asset in the repository.
	 * @param repo The UUID of the repository.
	 * @param name The name of the asset to update.
	 * @param options The new options for the asset.
	 * @scope `repo.assets.manage`
	 */
	public async update(repo: string, name: string, options: UpdateAssetRequest) {
		return this.client.patch<Asset>(
			this.format('/v1/repositories/:repo/assets/:name', { repo, name }),
			options
		);
	}

	/**
	 * Deletes an existing asset from the repository.
	 * @param repo The UUID of the repository.
	 * @param name The name of the asset to update.
	 * @scope `repo.assets.manage`
	 */
	public async delete(repo: string, name: string) {
		return this.client.delete<DeleteObjectResponse>(
			this.format('/v1/repositories/:repo/assets/:name', { repo, name })
		);
	}

}
