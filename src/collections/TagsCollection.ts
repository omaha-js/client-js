import { OmahaCollection } from '../client/OmahaCollection';
import { Tag } from '../entities/Tag';
import { DeleteObjectResponse } from './generic/DeleteObjectResponse';
import { CreateTagRequest } from './tags/CreateTagRequest';
import { UpdateTagRequest } from './tags/UpdateTagRequest';

export class TagsCollection extends OmahaCollection {

	/**
	 * Gets a list of all tags in the repository.
	 * @param repo The UUID of the repository.
	 */
	public async list(repo: string) {
		return this.client.get<Tag[]>(
			this.format('/v1/repositories/:repo/tags', { repo })
		);
	}

	/**
	 * Gets a specific tag in the repository.
	 * @param repo The UUID of the repository.
	 * @param name The name of the tag.
	 */
	public async get(repo: string, name: string) {
		return this.client.get<Tag>(
			this.format('/v1/repositories/:repo/tags/:name', { repo, name })
		);
	}

	/**
	 * Creates a new tag in the repository.
	 * @param repo The UUID of the repository.
	 * @param options The options for the new tag.
	 * @scope `repo.tags.manage`
	 */
	public async create(repo: string, options: CreateTagRequest) {
		return this.client.post<Tag>(
			this.format('/v1/repositories/:repo/tags', { repo }),
			options
		);
	}

	/**
	 * Updates an existing tag in the repository.
	 * @param repo The UUID of the repository.
	 * @param name The name of the tag to update.
	 * @param options The new options for the tag.
	 * @scope `repo.tags.manage`
	 */
	public async update(repo: string, name: string, options: UpdateTagRequest) {
		return this.client.patch<Tag>(
			this.format('/v1/repositories/:repo/tags/:name', { repo, name }),
			options
		);
	}

	/**
	 * Deletes an existing tag from the repository.
	 * @param repo The UUID of the repository.
	 * @param name The name of the tag to update.
	 * @scope `repo.tags.manage`
	 */
	public async delete(repo: string, name: string) {
		return this.client.delete<DeleteObjectResponse>(
			this.format('/v1/repositories/:repo/tags/:name', { repo, name })
		);
	}

}
