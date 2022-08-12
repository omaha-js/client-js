export interface CreateAssetRequest {

	/**
	 * The name of the asset.
	 */
	name: string;

	/**
	 * The description of the asset.
	 */
	description?: string;

	/**
	 * A boolean indicating whether new releases must provide an attachment for this asset before they can be
	 * published.
	 */
	required: boolean;

}
