import { Collaboration } from '../../entities/Collaboration';
import { Release } from '../../entities/Release';
import { Repository } from '../../entities/Repository';
import { WeeklyDownloadCount } from '../downloads/WeeklyDownloadCount';

export interface RepositoryOverview {

	/**
	 * The repository.
	 */
	repository: Repository;

	/**
	 * The user's collaboration for this repository.
	 */
	collaboration: Collaboration;

	/**
	 * The greatest published release for the repository or `undefined` if there aren't any published releases.
	 */
	release?: Release;

	/**
	 * The last year's worth of weekly download statistics for this repository.
	 */
	downloads: WeeklyDownloadCount[];

}
