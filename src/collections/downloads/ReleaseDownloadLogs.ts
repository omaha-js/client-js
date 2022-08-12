import { Release } from '../../entities/Release';
import { ReleaseDownload } from '../../entities/ReleaseDownload';
import { Pagination } from '../generic/Pagination';

export interface ReleaseDownloadLogs {
	release: Release;
	pagination: Pagination;
	logs: ReleaseDownload[];
}
