export interface OmahaOptions {

	/**
	 * The bearer token to use for authentication.
	 */
	token?: string;

	/**
	 * Reattempt requests that fail with a client-side error?
	 * @default true
	 */
	reattemptFailed?: boolean;

	/**
	 * The number of reattempts before giving up on a failed request and throwing the error. Set to `0` to retry an
	 * infinite number of times.
	 * @default 5
	 */
	reattemptFailedCount?: number;

	/**
	 * The number of milliseconds to wait between reattempts of failed requests.
	 * @default 2000
	 */
	reattemptFailedDelay?: number;

}
