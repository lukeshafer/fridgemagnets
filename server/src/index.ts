import { Game } from './rooms/Game';
import type { Server } from 'http';
import { Server as GameServer } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';

export const startGameServer = (server: Server) => {
	const gameServer = new GameServer({
		transport: new WebSocketTransport({
			server, // provide the custom server for `WebSocketTransport`
		}),
	});
	gameServer.define('lobby', Game);
};
