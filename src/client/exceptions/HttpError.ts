export class HttpError extends Error {

	public constructor(
		public readonly url: string,
		public readonly code: number,
		public readonly messages: string[]
	) {
		super(messages.join('; '));
		this.name = this.constructor.name;
	}

}
