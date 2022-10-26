import { EventEmitter } from '@baileyherbert/events';
import { Release } from '../entities/Release';
import { ReleaseAttachment } from '../entities/ReleaseAttachment';
import { Omaha } from './Omaha';
import io, { Socket } from 'socket.io-client';
import { RealtimeRepository } from '../collections/realtime/RealtimeRepository';
import { Subscription } from './realtime/Subscription';

export class OmahaRealtimeClient extends EventEmitter<RealtimeEvents> {

	protected clientActive = false;
	protected socketActive = false;
	protected socketConnected = false;
	protected socket?: Socket;
	protected subscriptions = new Set<Subscription>();

	private _nextSubscriptionId = 0;

	public constructor(protected readonly client: Omaha) {
		super();
	}

	/**
	 * Starts the realtime client.
	 */
	public start() {
		if (!this.clientActive) {
			this.clientActive = true;
			this.socketConnected = false;
			this._nextSubscriptionId = 0;
			this._startSocket();
		}
	}

	/**
	 * Stops the realtime client.
	 */
	public stop() {
		if (this.clientActive) {
			this.clientActive = false;
			this._stopSocket();
		}
	}

	private _startSocket() {
		if (!this.socketActive && this.client.getToken()) {
			const extraHeaders: Record<string, string> = {
				'Authorization': 'Bearer ' + this.client.getToken()
			};

			if (typeof window === 'undefined') {
				extraHeaders['User-Agent'] = 'Omaha Client (https://npmjs.com/@omaha/client)';
			}

			this.socketActive = true;
			this.socket = io(this.client._url + '/events', {
				extraHeaders
			});

			// Client events
			this.socket.on('connect', () => this.emit('connect'));
			this.socket.on('disconnect', (reason) => {
				this.socketConnected = false;
				this.emit('disconnect', reason);
			});
			this.socket.on('connect_error', (error) => {
				this.socketConnected = false;
				this.emit('connect_error', error);
			});

			// Omaha events
			this.socket.on('release_created', data => this.emit('release_created', data));
			this.socket.on('release_updated', data => this.emit('release_updated', data));
			this.socket.on('release_published', data => this.emit('release_published', data));
			this.socket.on('release_deleted', data => this.emit('release_deleted', data));
			this.socket.on('attachment_created', data => this.emit('attachment_created', data));
			this.socket.on('attachment_updated', data => this.emit('attachment_updated', data));
			this.socket.on('attachment_deleted', data => this.emit('attachment_deleted', data));

			// Send subscriptions upon ready
			this.socket.on('repositories', data => {
				this.emit('repositories', data);
				this.socketConnected = true;

				for (const subscription of this.subscriptions) {
					this._initSubscription(subscription);
				}
			});

			// Handle new releases on subscriptions
			this.socket.on('subscription:release', (id: number, release: Release) => {
				const subscription = [...this.subscriptions].find(sub => sub._subscriptionId === id);

				if (subscription) {
					subscription._update(release);
				}
			});
		}
	}

	private _stopSocket() {
		if (this.socketActive) {
			this.socket!.disconnect();
			this.socket = undefined;
			this.socketActive = false;
			this.socketConnected = false;
		}
	}

	/**
	 * @internal
	 */
	public _handleTokenUpdate() {
		if (this.clientActive) {
			if (this.client.getToken()) {
				this._startSocket();
			}
			else {
				this._stopSocket();
			}
		}
	}

	/**
	 * Subscribes to new releases on the specified repository which match the given constraint.
	 *
	 * @param id The UUID of the target repository.
	 * @param constraint The version constraint for filtering, such as `^1.0.0`.
	 * @param handler The callback function used to handle new release notifications.
	 */
	public subscribe(id: string, constraint: string, handler: SubscriptionHandler): Subscription {
		const sub = new Subscription(id, constraint, handler);
		this.subscriptions.add(sub);

		if (this.socketConnected) {
			this._initSubscription(sub);
		}

		sub.on('constraint', () => {
			if (sub._subscriptionId !== undefined && this.socketConnected && this.socket) {
				sub._pendingConstraintUpdate = true;

				this.socket.emit('subscription:update', sub._subscriptionId, sub.constraint, () => {
					sub._pendingConstraintUpdate = false;
				});
			}
		});

		sub.once('close', () => {
			this.subscriptions.delete(sub);

			if (sub._subscriptionId !== undefined && this.socketConnected && this.socket) {
				this.socket.emit('subscription:close', sub._subscriptionId);
			}
		});

		return sub;
	}

	/**
	 * Initializes the given subscription with the remote.
	 *
	 * @param subscription
	 */
	protected _initSubscription(subscription: Subscription) {
		if (this.socket) {
			const id = this._nextSubscriptionId++;
			subscription._init(id);

			this.socket.emit('subscribe', id, subscription.repositoryId, subscription.constraint, (release: Release | true | false) => {
				if (release === false) {
					return;
				}

				if (release === true) {
					subscription._update();
					return;
				}

				subscription._update(release);
			});
		}
	}

}

type RealtimeEvents = {
	connect: [];
	connect_error: [error: Error];
	disconnect: [reason: Socket.DisconnectReason];
	repositories: [ connections: RealtimeRepository[] ];
	release_created: [{ release: Release }];
	release_updated: [{ release: Release }];
	release_published: [{ release: Release }];
	release_deleted: [{ release: Release }];
	attachment_created: [{ attachment: ReleaseAttachment }];
	attachment_updated: [{ attachment: ReleaseAttachment }];
	attachment_deleted: [{ attachment: ReleaseAttachment }];
}

export type SubscriptionHandler = (release?: Release) => any;
