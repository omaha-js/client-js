import { ReleaseStatus } from './enum/ReleaseStatus';
import { ReleaseAttachment } from './ReleaseAttachment';

export interface Release {

	version: string;
	status: ReleaseStatus;
	description: string;
	download_count: number;
	created_at: Date;
	updated_at: Date;
	published_at: Date | null;
	archived_at: Date | null;
	purged_at: Date | null;
	tags?: string[];
	attachments?: ReleaseAttachment[];

}
