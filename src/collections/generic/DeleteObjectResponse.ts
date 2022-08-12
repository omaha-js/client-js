export interface DeleteObjectResponse {
	/**
	 * Whether the operation was successful (always true as an error will be generated if not).
	 */
	success: true;

	/**
	 * A message confirming that the object has been deleted.
	 */
	message: string;
}
