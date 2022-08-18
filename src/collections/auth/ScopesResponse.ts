import { CollaborationRole } from '../../entities/enum/CollaborationRole';
import { Scope } from '../../types/scopes';

export interface ScopesResponse {
	scopes: ScopeDescriptor[];
}

export type ScopeDescriptor = BaseScopeDescriptor & (RepoScopeDescriptor | AccountScopeDescriptor);

interface BaseScopeDescriptor {

	/**
	 * The ID of the scope.
	 */
	id: Scope;

	/**
	 * A human-friendly name for the scope.
	 */
	name: string;

	/**
	 * A description of what the scope grants access to.
	 */
	description: string;

	/**
	 * A boolean indicating whether the current user has access to this scope.
	 */
	active: boolean;

}

interface RepoScopeDescriptor {

	/**
	 * Whether the scope applies to accounts or repositories.
	 */
	type: 'repo';

	/**
	 * For repository scopes, this will be an array of collaboration roles which automatically inherit this scope.
	 */
	groups: CollaborationRole[];

}

interface AccountScopeDescriptor {

	/**
	 * Whether the scope applies to accounts or repositories.
	 */
	type: 'account';

}
