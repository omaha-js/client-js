import { Release } from '../../entities/Release';
import { WeeklyDownloadCount } from './WeeklyDownloadCount';

export interface ReleaseDownloadHistory {
	release: Release;
	history: WeeklyDownloadCount[];
}
