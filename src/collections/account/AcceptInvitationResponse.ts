import { Account } from '../../entities/Account';
import { Collaboration } from '../../entities/Collaboration';
import { Repository } from '../../entities/Repository';

export interface AcceptInvitationResponse extends Collaboration {
	account: Account;
	repository: Repository;
}
