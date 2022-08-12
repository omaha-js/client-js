import { ReleaseStatus } from '../../entities/enum/ReleaseStatus';

export interface UpdateReleaseRequest {

	/**
	 * The new description to use.
	 */
	description?: string;

	/**
	 * The new status to use. Note that downgrading the status is not possible and will error.
	 */
	status?: ReleaseStatus;

	/**
	 * The new tags to use. This will override all tags on the release.
	 */
	tags?: string[];

}
