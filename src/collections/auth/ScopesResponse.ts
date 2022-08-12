import { Scope } from '../../types/scopes';

export interface ScopesResponse {
	scopes: ScopeDescriptor[];
}

export interface ScopeDescriptor {

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
	 * Whether the scope applies to accounts or repositories.
	 */
	type: 'account' | 'repo';

	/**
	 * A boolean indicating whether the current user has access to this scope.
	 */
	active: boolean;

}
