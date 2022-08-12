import { Collaboration } from '../../entities/Collaboration';
import { Repository } from '../../entities/Repository';

export interface RepositoryWithCollaboration extends Repository {
	collaboration: Collaboration;
}
