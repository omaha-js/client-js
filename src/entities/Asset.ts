export interface Asset {

	/**
	 * The name of the asset.
	 */
	name: string;

	/**
	 * The description of the asset.
	 */
	description: string;

	/**
	 * A boolean indicating whether releases must provide an attachment for this asset before they can be published.
	 */
	required: boolean;

	/**
	 * The date/time at which this asset was created.
	 */
	created_at: Date;

	/**
	 * The date/time at which this asset was updated.
	 */
	updated_at: Date;

}
