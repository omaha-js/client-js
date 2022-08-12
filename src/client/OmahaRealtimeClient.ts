import { EventEmitter } from '@baileyherbert/events';
import { Release } from '../entities/Release';
import { ReleaseAttachment } from '../entities/ReleaseAttachment';
import { Omaha } from './Omaha';
import io, { Socket } from 'socket.io-client';
import { RealtimeRepository } from '../collections/realtime/RealtimeRepository';

export class OmahaRealtimeClient extends EventEmitter<RealtimeEvents> {

	protected clientActive = false;
	protected socketActive = false;
	protected socket?: Socket;

	public constructor(protected readonly client: Omaha) {
		super();
	}

	/**
	 * Starts the realtime client.
	 */
	public start() {
		if (!this.clientActive) {
			this.clientActive = true;
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
			this.socketActive = true;
			this.socket = io(this.client._url + '/events', {
				extraHeaders: {
					'User-Agent': 'Omaha Client (https://npmjs.com/@omaha/client)',
					'Authorization': 'Bearer ' + this.client.getToken()
				}
			});

			// Client events
			this.socket.on('connect', () => this.emit('connect'));
			this.socket.on('disconnect', (reason) => this.emit('disconnect', reason));
			this.socket.on('connect_error', (error) => this.emit('connect_error', error));

			// Omaha events
			this.socket.on('repositories', data => this.emit('repositories', data));
			this.socket.on('release_created', data => this.emit('release_created', data));
			this.socket.on('release_updated', data => this.emit('release_updated', data));
			this.socket.on('release_published', data => this.emit('release_published', data));
			this.socket.on('release_deleted', data => this.emit('release_deleted', data));
			this.socket.on('attachment_created', data => this.emit('attachment_created', data));
			this.socket.on('attachment_updated', data => this.emit('attachment_updated', data));
			this.socket.on('attachment_deleted', data => this.emit('attachment_deleted', data));
		}
	}

	private _stopSocket() {
		if (this.socketActive) {
			this.socket!.disconnect();
			this.socket = undefined;
			this.socketActive = false;
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
