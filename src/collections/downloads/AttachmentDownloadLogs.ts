import { ReleaseAttachment } from '../../entities/ReleaseAttachment';
import { ReleaseDownload } from '../../entities/ReleaseDownload';
import { Pagination } from '../generic/Pagination';

export interface AttachmentDownloadLogs {
	attachment: ReleaseAttachment;
	pagination: Pagination;
	logs: ReleaseDownload[];
}
