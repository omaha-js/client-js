import { Release } from './Release';

export interface ReleaseAttachment {
	asset: string;
	file_name: string;
	mime: string;
	size: number;
	hash_sha1: string;
	hash_md5: string;
	download_count: number;
	created_at: Date;
	updated_at: Date;
	release?: Release;
}
