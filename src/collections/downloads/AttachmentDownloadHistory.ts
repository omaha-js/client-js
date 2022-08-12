import { ReleaseAttachment } from '../../entities/ReleaseAttachment';
import { WeeklyDownloadCount } from './WeeklyDownloadCount';

export interface AttachmentDownloadHistory {
	attachment: ReleaseAttachment;
	history: WeeklyDownloadCount[];
}
