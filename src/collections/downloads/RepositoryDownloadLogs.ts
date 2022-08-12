import { ReleaseDownload } from '../../entities/ReleaseDownload';
import { Repository } from '../../entities/Repository';
import { Pagination } from '../generic/Pagination';

export interface RepositoryDownloadLogs {
	repository: Repository;
	pagination: Pagination;
	logs: ReleaseDownload[];
}
