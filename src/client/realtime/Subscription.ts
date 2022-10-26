import { EventEmitter } from '@baileyherbert/events';
import { Socket } from 'socket.io-client';
import { Release } from '../../entities/Release';
import { SubscriptionHandler } from '../OmahaRealtimeClient';

export class Subscription extends EventEmitter<SubscriptionEvents> {

	public _id: string;
	private _constraint: string;
	private _handler: SubscriptionHandler;
	private _version?: string;
	private _active = false;
	private _closed = false;

	/**
	 * @internal
	 * */
	public _pendingConstraintUpdate = false;

	/**
	 * @internal
	 */
	public _subscriptionId?: number;

	public constructor(repoId: string, constraint: string, handler: SubscriptionHandler) {
		super();

		this._id = repoId;
		this._constraint = constraint;
		this._handler = handler;
	}

	/**
	 * The UUID of the remote repository.
	 */
	public get repositoryId() {
		return this._id;
	}

	/**
	 * The current constraint.
	 */
	public get constraint() {
		return this._constraint;
	}

	/**
	 * Updates the filtering constraint on the server for further notifications.
	 *
	 * @param constraint
	 */
	public setConstraint(constraint: string) {
		this._constraint = constraint;
		this.emit('constraint');
	}

	/**
	 * Closes the subscription.
	 */
	public close() {
		if (!this._closed) {
			this._closed = true;
			this.emit('close');
		}
	}

	/**
	 * @internal
	 */
	public _init(subscriptionId: number) {
		this._subscriptionId = subscriptionId;
	}

	/**
	 * @internal
	 */
	public _update(release?: Release) {
		const version = release?.version;

		if (this._closed) return;
		if (this._pendingConstraintUpdate) return;
		if (this._version !== version || !this._active) {
			this._active = true;
			this._version = version;
			this._handler(release);
		}
	}

}

type SubscriptionEvents = {
	constraint: [];
	close: [];
}
