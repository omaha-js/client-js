import { Repository } from '../../entities/Repository';
import { RepositoryScope } from '../../types/scopes';

export interface RealtimeRepository {
	repository: Repository;
	scopes: RepositoryScope[];
}
