import Arena from '@colyseus/arena';
import { monitor } from '@colyseus/monitor';

/**
 * Import your Room files
 */
import { MyRoom } from './rooms/MyRoom';

export default Arena({
	getId: () => 'Fridge Magnets App',

	initializeGameServer: (gameServer) => {
		/**
		 * Define your room handlers:
		 */
		gameServer.define('lobby', MyRoom);
	},

	initializeExpress: (app) => {
		/**
		 * Bind your custom express routes here:
		 */
		app.get('/', (_req, res) => {
			res.send('Hey! This is the server, get outta here!');
		});

		/**
		 * Bind @colyseus/monitor
		 * It is recommended to protect this route with a password.
		 * Read more: https://docs.colyseus.io/tools/monitor/
		 */
		app.use('/colyseus', monitor());
	},

	beforeListen: () => {
		/**
		 * Before before gameServer.listen() is called.
		 */
	},
});
