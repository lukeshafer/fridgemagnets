import { Game } from './rooms/Game';
import { createServer } from 'http';
import type { Server } from 'http';
import { Server as GameServer } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import express from 'express';

export const startGameServer = (server: Server) => {
	const gameServer = new GameServer({
		transport: new WebSocketTransport({
			server, // provide the custom server for `WebSocketTransport`
		}),
	});
	gameServer.define('lobby', Game);
};

if (process.env.TS_NODE_DEV) {
	const port = process.env.PORT || 2567;
	const app = express();
	const server = createServer(app);
	startGameServer(server);

	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
}
