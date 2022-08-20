import { EventEmitter } from '@baileyherbert/events';
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
import { AbortError } from './exceptions/AbortError';
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
import { OmahaRealtimeClient } from './OmahaRealtimeClient';
import { DOMException, fetch } from './util/fetch';
import FormData from 'form-data';
import { NotificationsCollection } from '../collections/NotificationsCollection';

export class Omaha extends EventEmitter<OmahaEvents> {

	/**
	 * The root URL of the target omaha installation without any trailing slashes.
	 * @internal
	 */
	public readonly _url: string;

	/**
	 * The bearer token to use for authentication (or undefined if working in public mode).
	 */
	private _token?: string;

	/**
	 * A map of collection instances keyed by their constructors.
	 */
	private _collections = new Map<CollectionConstructor<any>, OmahaCollection>();

	/**
	 * The mock response for testing.
	 */
	private _mockResponse?: any;

	/**
	 * A boolean indicating whether to reattempt failed requests.
	 */
	private _reattemptFailed = true;

	/**
	 * The number of attempts to perform for failed requests.
	 */
	private _reattemptFailedCount = 5;

	/**
	 * The number of milliseconds to wait between reattempts.
	 */
	private _reattemptFailedDelay = 2000;

	/**
	 * A set of objects that track reattempt timeouts and functions to cancel them.
	 */
	private _reattemptTasks = new Set<Reattempt>();

	/**
	 * The number of requests being worked on right now.
	 */
	private _workers = 0;

	/**
	 * The parent instance (for clones).
	 */
	private _parent?: Omaha;

	/**
	 * The abort controller for this instance.
	 */
	private _controller: AbortController;

	/**
	 * The realtime websocket client for this instance.
	 */
	public readonly ws: OmahaRealtimeClient;

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
		super(false);

		this.ws = new OmahaRealtimeClient(this);
		this._controller = new AbortController();

		if (typeof urlOrOptions === 'string') {
			this._url = this._validateRootUrl(urlOrOptions);
			this._token = extraOptions?.token;
			this._validateOptions(extraOptions);
		}
		else {
			this._url = this._validateRootUrl(urlOrOptions.url);
			this._token = urlOrOptions.token;
			this._validateOptions(urlOrOptions);
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
	 * A collection of endpoints for working with notifications.
	 */
	public get notifications() {
		return this._getCachedCollection(NotificationsCollection);
	}

	/**
	 * Sends a `GET` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param params An option containing the query parameters to send.
	 * @returns
	 */
	public async get<T>(path: string, params?: any): Promise<T> {
		if (typeof params === 'object') {
			const search = typeof window === 'object' && typeof window.URLSearchParams === 'function' ?
				new window.URLSearchParams() :
				new URLSearchParams();

			const keys = Object.keys(params);

			if (keys.length > 0) {
				for (const key of keys) {
					const value = params[key];

					if (typeof value !== 'undefined') {
						const transformed = Array.isArray(value) ?
							value.map(v => v.toString()).join(',') :
							value.toString();

						search.append(key, transformed);
					}
				}

				path += '?' + search.toString();
			}
		}

		return this._fetchWithTracking<T>('GET', path);
	}

	/**
	 * Sends a `POST` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async post<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetchWithTracking<T>('POST', path, body);
	}

	/**
	 * Sends a `PUT` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async put<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetchWithTracking<T>('PUT', path, body);
	}

	/**
	 * Sends a `PATCH` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async patch<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetchWithTracking<T>('PATCH', path, body);
	}

	/**
	 * Sends a `DELETE` request to the remote server and returns the response.
	 * @param path The path of the endpoint to request.
	 * @param body The body object to send as JSON.
	 * @returns
	 */
	public async delete<T>(path: string, body?: PostOptions): Promise<T> {
		return this._fetchWithTracking<T>('DELETE', path, body);
	}

	/**
	 * Forwards parameters to `this._fetchWithRetries()` but tracks the number of active workers and emits events
	 * accordingly.
	 * @param method
	 * @param path
	 * @param body
	 * @returns
	 */
	private _fetchWithTracking<T>(method: string, path: string, body?: PostOptions): Promise<T> {
		this._startWorking();
		return this._fetchWithRetries<T>(method, path, body).finally(() => this._stopWorking());
	}

	/**
	 * Forwards parameters to `this._fetch()` but catches client-side errors and reattempts the requests according to
	 * the client configuration.
	 * @param method
	 * @param path
	 * @param body
	 * @param attempt
	 * @returns
	 */
	private async _fetchWithRetries<T>(method: string, path: string, body?: PostOptions, attempt = 0): Promise<T> {
		const controller = this._controller;

		try {
			const response = await this._fetch<T>(method, path, body);

			if (attempt > 0) {
				this.emit('client_recovered', attempt - 1);
			}

			return response;
		}
		catch (error) {
			if (error instanceof HttpError) {
				this.emit('error', error);
				this.emit('server_error', error);
				throw error;
			}
			else if (error instanceof Error || (typeof DOMException !== 'undefined' && error instanceof DOMException)) {
				if (controller !== this._controller || error.name === 'AbortError' || error.message.endsWith('The user aborted a request.')) {
					throw new AbortError('The operation was aborted.');
				}

				this.emit('error', error);
				this.emit('client_error', error, attempt, this._reattemptFailed ? this._reattemptFailedCount : undefined);

				if (this._reattemptFailed && (this._reattemptFailedCount === 0 || attempt < this._reattemptFailedCount)) {
					const o: any = {};

					const resume = await new Promise<boolean>(resolve => {
						o.timeout = setTimeout(() => resolve(true), this._reattemptFailedDelay);
						o.cancel = () => resolve(false);

						this._reattemptTasks.add(o);
					});

					this._reattemptTasks.delete(o);

					if (!resume) {
						throw new AbortError(
							'The request was aborted while attempting to recover from an error:\n' + error.stack
						);
					}

					return this._fetchWithRetries(method, path, body, attempt + 1);
				}

				throw error;
			}
			else {
				throw new Error(`Caught non-error of type ${typeof error} within fetch - this should never happen!`);
			}
		}
	}

	/**
	 * Executes an HTTP request with the given parameters, throws transformed exceptions, and returns the parsed body.
	 * @param method
	 * @param path
	 * @param body
	 * @returns
	 */
	private async _fetch<T>(method: string, path: string, body?: PostOptions): Promise<T> {
		if (typeof this._mockResponse !== 'undefined') {
			const mock = this._mockResponse;
			this._mockResponse = undefined;

			if (mock instanceof HttpError) {
				throw mock;
			}

			return mock;
		}

		const requestHeaders: Record<string, string> = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};

		if (typeof window === 'undefined') {
			requestHeaders['User-Agent'] = 'Omaha Client (https://npmjs.com/@omaha/client)';
		}

		if (body instanceof FormData) {
			delete requestHeaders['Content-Type'];
		}

		if (typeof this.getToken() === 'string') {
			requestHeaders['Authorization'] = 'Bearer ' + this.getToken();
		}

		const response = await fetch(this._url + '/' + path.replace(/^\/+/, ''), {
			method,
			headers: requestHeaders,
			// @ts-ignore
			body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
			signal: this._controller.signal
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
	 * Validates and applies the constructor options.
	 * @param options
	 */
	private _validateOptions(options: OmahaOptions = {}) {
		if (typeof options.reattemptFailed === 'boolean') {
			this._reattemptFailed = options.reattemptFailed;
		}

		if (typeof options.reattemptFailedCount === 'number') {
			this._reattemptFailedCount = options.reattemptFailedCount;
		}

		if (typeof options.reattemptFailedDelay === 'number') {
			this._reattemptFailedDelay = options.reattemptFailedDelay;
		}
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

	/**
	 * Updates the token on the client.
	 * @param token
	 */
	public setToken(token?: string): void {
		if (this._parent) {
			return this._parent.setToken(token);
		}

		if (typeof token === 'string') {
			token = token.trim();

			if (token.length === 0) {
				token = undefined;
			}
		}

		if (this._token !== token) {
			this._token = token;
			this.ws._handleTokenUpdate();
			this.emit('token', token);
		}
	}

	/**
	 * Returns the current token.
	 */
	public getToken(): string | undefined {
		if (this._parent) {
			return this._parent.getToken();
		}

		return this._token;
	}

	/**
	 * Creates a clone of this client instance that uses the same token. This is most useful for aborting a subset of
	 * requests without affecting others.
	 */
	public derive() {
		const client = new Omaha({
			url: this._url,
			token: this._token,
			reattemptFailed: this._reattemptFailed,
			reattemptFailedCount: this._reattemptFailedCount,
			reattemptFailedDelay: this._reattemptFailedDelay
		});

		client._parent = this;
		return client;
	}

	/**
	 * Aborts all active requests on the client.
	 */
	public abort() {
		this._controller.abort();
		this._controller = new AbortController();

		// Cancel failed requests that are currently waiting for their next attempt
		for (const task of this._reattemptTasks) {
			task.cancel();
		}
	}

	/**
	 * Cleans up the instance, removes all listeners, and aborts all active requests on the client.
	 */
	public dispose() {
		this.abort();
		this.removeAllListeners();
		this._parent = undefined;
		this._reattemptTasks.clear();
		this._collections.clear();
		this._token = undefined;
	}

	/**
	 * Records that a new request is being worked on. This might emit the `loading_start` event if it's the first
	 * concurrent request.
	 */
	private _startWorking() {
		if (this._workers++ === 0) {
			this.emit('loading_start');
		}
	}

	/**
	 * Records that a request has completed or failed. This might emit the `loading_stop` event if it's the last
	 * request remaining.
	 */
	private _stopWorking() {
		if (--this._workers === 0) {
			this.emit('loading_stop');
		}

		if (this._workers < 0) {
			throw new Error('Active worker count fell below 0 - this should never happen!');
		}
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

type OmahaEvents = {

	/**
	 * Emitted when a request fails for any reason.
	 */
	error: [error: Error];

	/**
	 * Emitted when the server returns an error code.
	 */
	server_error: [error: HttpError];

	/**
	 * Emitted when a client-side error occurs.
	 * @param error
	 *   The error that was thrown.
	 * @param attempt
	 *   The current attempt number (starts at 0).
	 * @param maxAttempts
	 *   The maximum number of attempts configured on the client. This will be `undefined` when reattempts are disabled,
	 *   or `0` when there is no configured limit.
	 */
	client_error: [error: Error, attempt: number, maxAttempts?: number];

	/**
	 * Emitted when the client recovers from an error.
	 * @param attempts The total number of reattempts it took to recover.
	 */
	client_recovered: [attempts: number];

	/**
	 * Emitted when the client's token changes.
	 * @param token The new token (or undefined if signed out).
	 */
	token: [token?: string];

	/**
	 * Emitted when the client starts working on one or more requests. It will not be emitted again until after the
	 * `loading_stop` event is emitted.
	 */
	loading_start: [];

	/**
	 * Emitted when the client finishes all outstanding requests and has nothing left to do.
	 */
	loading_stop: [];

}

interface Reattempt {
	timeout: NodeJS.Timeout;
	cancel: () => void;
}
