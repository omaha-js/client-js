/**
 * Thrown when the request is aborted.
 */
export class AbortError extends Error {
	public constructor(message: string) {
		super(message);
		this.name = 'AbortError';
	}
}
