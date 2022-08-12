import { URLSearchParams } from 'url';
import { AccountCollection } from '../collections/AccountCollection';
import { AssetsCollection } from '../collections/AssetsCollection';
import { AttachmentsCollection } from '../collections/AttachmentsCollection';
import { AuthCollection } from '../collections/AuthCollection';
import { CollabsCollection } from '../collections/CollabsCollection';
import { DownloadsCollection } from '../collections/DownloadsCollection';
import { InvitesCollection } from '../collections/InvitesCollection';
import { ReleasesCollection } from '../collections/ReleasesCollection';
import { RepositoryCollection } from '../collections/RepositoryCollection';
import { TagsCollection } from '../collections/TagsCollection';
import { BadGatewayError } from './exceptions/BadGatewayError';
import { BadRequestError } from './exceptions/BadRequestError';
import { ForbiddenError } from './exceptions/ForbiddenError';
import { GatewayTimeoutError } from './exceptions/GatewayTimeoutError';
import { HttpError } from './exceptions/HttpError';
import { InternalServerError } from './exceptions/InternalServerError';
import { MethodNotAllowedError } from './exceptions/MethodNotAllowedError';
import { NotAcceptableError } from './exceptions/NotAcceptableError';
import { NotFoundError } from './exceptions/NotFoundError';
import { PayloadTooLargeError } from './exceptions/PayloadTooLargeError';
import { RequestTimeoutError } from './exceptions/RequestTimeoutError';
import { ServiceUnavailableError } from './exceptions/ServiceUnavailableError';
import { TooManyRequestsError } from './exceptions/TooManyRequestsError';
import { UnauthorizedError } from './exceptions/UnauthorizedError';
import { OmahaCollection } from './OmahaCollection';
import { OmahaOptions } from './OmahaOptions';

export class Omaha {

	/**
	 * The root URL of the target omaha installation.
	 * @internal
	 */
	public readonly _url: string;

	/**
	 * The bearer token to use for authentication (or undefined if working in public mode).
	 * @internal
	 */
	public _token?: string;

	/**
	 * A map of collection instances keyed by their constructors.
	 */
	private _collections = new Map<CollectionConstructor<any>, OmahaCollection>();

	/**
	 * The mock response for testing.
	 */
	private _mockResponse?: any;

	/**
	 * Constructs a new instance of the omaha client for the target installation.
	 * @param url The root URL of the target omaha installation.
	 */
	public constructor(url: string);

	/**
	 * Constructs a new instance of the omaha client for the target installation.
	 * @param url The root URL of the target omaha installation.
	 * @param options An object with additional options for the client, such as authentication.
	 */
	public constructor(url: string, options?: OmahaOptions);

	/**
	 * Constructs a new instance of the omaha client with the given options.
	 * @param options An object with options for the client, such as the root URL and authentication.
	 */
	public constructor(options: OmahaOptionsWithUrl);
	public constructor(urlOrOptions: string | OmahaOptionsWithUrl, extraOptions?: OmahaOptions) {
		if (typeof urlOrOptions === 'string') {
			this._url = this._validateRootUrl(urlOrOptions);
			this._token = extraOptions?.token;
		}
		else {
			this._url = this._validateRootUrl(urlOrOptions.url);
			this._token = urlOrOptions.token;
		}
	}

	/**
	 * A collection of endpoints for working with authentication.
	 */
	public get auth() {
		return this._getCachedCollection(AuthCollection);
	}

	/**
	 * A collection of endpoints for working with accounts.
	 */
	public get account() {
		return this._getCachedCollection(AccountCollection);
	}

	/**
	 * A collection of endpoints for working with repositories.
	 */
	public get repos() {
		return this._getCachedCollection(RepositoryCollection);
	}

	/**
	 * A collection of endpoints for working with downloads in repositories.
	 */
	public get downloads() {
		return this._getCachedCollection(DownloadsCollection);
	}

	/**
	 * A collection of endpoints for working with collaborations in repositories.
	 */
	public get collabs() {
		return this._getCachedCollection(CollabsCollection);
	}

	/**
	 * A collection of endpoints for working with collaboration invites in repositories.
	 */
	public get invites() {
		return this._getCachedCollection(InvitesCollection);
	}

	/**
	 * A collection of endpoints for working with tags in repositories.
	 */
	public get tags() {
		return this._getCachedCollection(TagsCollection);
	}

	/**
	 * A collection of endpoints for working with assets in repositories.
	 */
	public get assets() {
		return this._getCachedCollection(AssetsCollection);
	}

	/**
	 * A collection of endpoints for working with releases in repositories.
	 */
	public get releases() {
		return this._getCachedCollection(ReleasesCollection);
	}

	/**
	 * A collection of endpoints for working with release attachments in repositories.
	 */
	public get attachments() {
		return this._getCachedCollection(AttachmentsCollection);
	}

	/**
	 * Sends a `GET` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param params An option containing the query parameters to send.
	 * @returns
	 */
	public async get<T>(path: string, params?: any): Promise<T> {
		if (typeof params === 'object') {
			const search = new URLSearchParams();
			const keys = Object.keys(params);

			if (keys.length > 0) {
				for (const key of keys) {
					const value = params[key];
					const transformed = Array.isArray(value) ? value.map(v => v.toString()).join(',') : value.toString();

					search.append(key, transformed);
				}

				path += '?' + search.toString();
			}
		}

		return this._fetch<T>('GET', path);
	}

	/**
	 * Sends a `POST` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async post<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetch<T>('POST', path, body);
	}

	/**
	 * Sends a `PUT` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async put<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetch<T>('PUT', path, body);
	}

	/**
	 * Sends a `PATCH` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async patch<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetch<T>('PATCH', path, body);
	}

	/**
	 * Sends a `DELETE` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async delete<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetch<T>('DELETE', path, body);
	}

	/**
	 * Executes an HTTP request with the given parameters, throws transformed exceptions, and returns the parsed body.
	 * @param method
	 * @param path
	 * @param body
	 * @param headers
	 * @returns
	 */
	private async _fetch<T>(method: string, path: string, body?: PostOptions, headers?: Record<string, any>): Promise<T> {
		if (typeof this._mockResponse !== 'undefined') {
			const mock = this._mockResponse;
			this._mockResponse = undefined;

			if (mock instanceof HttpError) {
				throw mock;
			}

			return mock;
		}

		const requestHeaders: Record<string, string> = {
			'User-Agent': 'Omaha Client (https://npmjs.com/@omaha/client)',
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers
		};

		if (body instanceof FormData) {
			delete requestHeaders['Content-Type'];
		}

		if (typeof this._token === 'string') {
			requestHeaders['Authorization'] = 'Bearer ' + this._token;
		}

		const response = await fetch(this._url + '/' + path.replace(/^\/+/, ''), {
			method,
			headers: requestHeaders,
			// @ts-ignore
			body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
		});

		// Throw for erroneous responses
		if (response.status >= 400) {
			throw await this._createException(response);
		}

		// Throw for unexpected status codes
		if (response.status > 201 || response.status < 200) {
			throw new Error(`Received unexpected status ${response.status} ${response.statusText}`.trim());
		}

		if (!response.ok) {
			throw new Error(`Response was marked as erroneous but no errors were generated`);
		}

		return this._parseResponseText(response) as Promise<T>;
	}

	/**
	 * Parses the response as JSON with dates formatted.
	 *
	 * @param response
	 * @returns
	 */
	private async _parseResponseText(response: Response): Promise<any> {
		try {
			return JSON.parse(await response.text(), this._convertDates);
		}
		catch (err) {
			if (err instanceof Error) {
				throw new Error(`Error when parsing response: ${err.constructor.name}: ${err.message}`);
			}
			else {
				throw new Error(`Error of type ${typeof err} when parsing response`);
			}
		}
	}

	/**
	 * A JSON reviver function that converts date/time strings into real date objects when their keys are one of
	 * `time`, `date`, or end with `_at`.
	 * @param key
	 * @param value
	 * @returns
	 */
	private _convertDates(key: string, value: any) {
		if (value == null) {
			return value;
		}

		if (key.endsWith('_at') || key === 'time' || key === 'date' || key.startsWith('date_')) {
			if (typeof value !== 'string' || !value.endsWith('Z')) {
				throw new Error(`Error parsing field "${key}" in response as a date with value: ${value}`);
			}

			return new Date(value);
		}

		return value;
	}

	/**
	 * Validates the given input URL and returns it with trailing slashes removed.
	 * @param input
	 * @returns
	 */
	private _validateRootUrl(input: string) {
		const url = new URL(input);
		return url.href.replace(/\/+$/, '');
	}

	/**
	 * Gets a cached instance of the given collection constructor.
	 * @param constructor
	 * @returns
	 * @internal
	 */
	public _getCachedCollection<T extends OmahaCollection>(constructor: CollectionConstructor<T>): T {
		if (!this._collections.has(constructor)) {
			this._collections.set(constructor, new constructor(this));
		}

		return this._collections.get(constructor)! as T;
	}

	/**
	 * Creates and returns an appropriate error instance for the response.
	 * @param response
	 * @returns
	 */
	private async _createException(response: Response) {
		const url = response.url;
		const code = response.status;
		const messages = await this._getExceptionMessages(response);

		switch (code) {
			case 400: return new BadRequestError(url, code, messages);
			case 401: return new UnauthorizedError(url, code, messages);
			case 403: return new ForbiddenError(url, code, messages);
			case 404: return new NotFoundError(url, code, messages);
			case 405: return new MethodNotAllowedError(url, code, messages);
			case 406: return new NotAcceptableError(url, code, messages);
			case 408: return new RequestTimeoutError(url, code, messages);
			case 413: return new PayloadTooLargeError(url, code, messages);
			case 429: return new TooManyRequestsError(url, code, messages);
			case 500: return new InternalServerError(url, code, messages);
			case 502: return new BadGatewayError(url, code, messages);
			case 503: return new ServiceUnavailableError(url, code, messages);
			case 504: return new GatewayTimeoutError(url, code, messages);
		}

		return new HttpError(url, code, messages);
	}

	/**
	 * Gets the error messages from an erroneous response.
	 * @param response
	 * @returns
	 */
	private async _getExceptionMessages(response: Response): Promise<string[]> {
		const body = await response.text();

		if (body.startsWith('{')) {
			const response = JSON.parse(body);

			if ('message' in response) {
				return Array.isArray(response.message) ? response.message : [response.message];
			}
		}

		return [`${response.status} ${response.statusText}`.trim()];
	}

	/**
	 * Sets the next mock response. Returns the same exact object to test equality. Note that the object will be
	 * converted to and from JSON before being returned, and dates will also be recreated using the same behavior as
	 * the client's response handler.
	 * @param response
	 * @internal
	 */
	public mock<T extends {}>(response: T): T;

	/**
	 * Sets the next mock response error. Returns the same exact error object.
	 * @param error
	 * @internal
	 */
	public mock<T extends HttpError>(error: T): T;
	public mock(response: any) {
		this._mockResponse = response;

		if (!(response instanceof HttpError)) {
			// Convert to and from JSON with dates converted
			// This will ensure all dates are converting properly and that the request is valid JSON
			return JSON.parse(
				JSON.stringify(response),
				this._convertDates
			);
		}

		return response;
	}

}

export interface OmahaOptionsWithUrl extends OmahaOptions {

	/**
	 * The root URL of the target omaha installation.
	 * @example 'https://omaha.example.com'
	 */
	url: string;

}

type CollectionConstructor<T extends OmahaCollection> = new (client: Omaha) => T;

export type PostOptions = Record<string, any> | FormData;
