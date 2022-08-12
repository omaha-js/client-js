import { Repository } from '../../entities/Repository';
import { WeeklyDownloadCount } from './WeeklyDownloadCount';

export interface RepositoryDownloadHistory {
	repository: Repository;
	history: WeeklyDownloadCount[];
}
