import { Room, Client } from 'colyseus';
import { MyRoomState, Player, Piece } from './schema/MyRoomState';

import { resetPlayers } from './functions/resetPlayers';
import { generateRoomId } from './functions/room';

const LOBBY_CHANNEL = '$mylobby';

export class Game extends Room<MyRoomState> {
	// default options
	options = {
		maxClients: 8,
		handSize: 60,
	};
	currentPrompt = '';
	players: IterableIterator<string> | undefined;
	started = false;
	safeToAdvance = true;

	roundCountdown: NodeJS.Timeout;

	async onCreate(options: any) {
		const currentIds = await this.presence.smembers(LOBBY_CHANNEL);
		this.roomId = await generateRoomId(currentIds);
		await this.presence.sadd(LOBBY_CHANNEL, this.roomId);
		console.log('Creating room', this.roomId);
		// Setting options, or leaving defaults
		this.options.handSize = options.handSize || this.options.handSize;
		this.options.maxClients = options.maxClients || this.options.maxClients;

		if (options.private) {
			this.setPrivate(true);
		}

		this.setState(new MyRoomState());

		console.log('room', this.roomId, 'created!', options);

		this.onMessage('start', (client) => {
			// if client is vip and there are at least 3 players, call startGame()
			if (
				this.state.players.get(client.sessionId).isVIP &&
				this.state.players.size >= 1
			) {
				this.startGame();
			} else {
				console.log('Not enough players to start the game!');
			}
		});

		this.onMessage('addPieceToCard', (client, piece: Piece) => {
			this.state.players.get(client.sessionId).submission.push(piece);
		});

		this.onMessage('submitAnswer', (client) => {
			this.state.players.get(client.sessionId).status = 'finished';
			const playersArray = Array.from(this.state.players.values());
			if (playersArray.every(({ status }) => status === 'finished')) {
				this.startShowcase();
			}
		});

		this.onMessage('updateCard', (client, message: { pieces: Piece[] }) => {
			this.state.players.get(client.sessionId).submission.clear();
			message.pieces.forEach((piece) => {
				const p = new Piece(piece.word, piece.id, piece.x, piece.y);
				this.state.players.get(client.sessionId).submission.push(p);
			});
		});

		this.onMessage('cancel', (client) => {
			this.state.players.get(client.sessionId).status = 'editing';
		});

		this.onMessage('advanceShowcase', () => {
			if (this.safeToAdvance) {
				this.advanceShowcase();
				this.safeToAdvance = false;
				setTimeout(() => (this.safeToAdvance = true), 2000);
			}
		});
	}

	startGame() {
		this.lock();
		this.started = true;
		this.state.deck.shuffle();
		console.log('Dealing cards...');
		this.dealHands();
		this.state.gamePhase = 'playing';
		this.state.players.forEach((player) => {
			player.status = 'editing';
		});
		console.log('Drawing prompt...');
		this.state.currentPrompt = this.state.PromptDeck.draw();
		console.log('Game started!');
		// this.roundCountdown = setTimeout(this.startShowcase, 1000);
	}

	test() {
		console.log('Test method');
	}

	dealHands() {
		for (let i = 0; i < this.options.handSize; i++) {
			this.state.players.forEach((player) => {
				let card = this.state.deck.deal();
				player.hand.push(card);
			});
		}
	}

	startShowcase() {
		console.log('starting showcase');
		clearTimeout(this.roundCountdown);
		this.players = this.state.players.keys();
		this.state.gamePhase = 'showcase';
		this.advanceShowcase();
	}

	advanceShowcase() {
		const next = this.players.next();
		if (typeof next.value === 'string') {
			this.state.showcaseID = next.value;
		} else if (next.done) {
			this.newRound();
		} else {
			// the value was invalid for some reason - advance again
			this.advanceShowcase();
		}
	}

	newRound() {
		this.state.gamePhase = 'resetting';
		resetPlayers(this.state);
		this.state.showcaseID = '';
		this.state.currentPrompt = this.state.PromptDeck.draw();
		this.state.gamePhase = 'playing';
		// this.roundCountdown = setTimeout(this.startShowcase, 90000);
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'joined!');

		// create Player instance
		const player = new Player();
		player.name = options.name;

		// if no players yet, set this one as VIP
		if (this.state.players.size === 0) {
			player.isVIP = true;
		}

		let vip = false;
		this.state.players.forEach((player) => {
			if (player.isVIP) vip = true;
		});
		if (!vip) player.isVIP = true;

		// place player in the map of players by its sessionId
		// (client.sessionId is unique per connection!)
		this.state.players.set(client.sessionId, player);
	}

	async onLeave(client: Client, consented: boolean) {
		const player = this.state.players.get(client.sessionId);

		console.log(client.sessionId, 'left!');

		// if player is VIP, assign new VIP
		if (player.isVIP) {
			for (const [_key, p] of this.state.players) {
				if (p === player) continue;
				p.isVIP = true;
				break;
			}
			player.isVIP = false;
		}

		player.connected = false;

		try {
			if (consented) {
				throw new Error('consented leave');
			}

			// allow disconnected client to reconnect into this room for X seconds
			const reconnectTime = this.started ? 60 : 20;
			await this.allowReconnection(client, reconnectTime);

			// client returned! let's re-activate it.
			player.connected = true;
			console.log(client.sessionId, 're-joined!');
			return;
		} catch (e) {
			// 20 seconds expired. let's remove the client.
			this.state.players.delete(client.sessionId);
		}
		console.log('Deleting player');
		this.state.players.delete(client.sessionId);
	}

	async onDispose() {
		// this.roomId = await this.generateRoomId();
		this.presence.srem(LOBBY_CHANNEL, this.roomId);
		console.log('room', this.roomId, 'disposing...');
	}
}
