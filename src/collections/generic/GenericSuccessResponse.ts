export interface GenericSuccessResponse {

	/**
	 * Whether the operation was successful (always true as an error will be generated if not).
	 */
	success: true;

	/**
	 * A message confirming that the operation was a success.
	 */
	message: string;

}
