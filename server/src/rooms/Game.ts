import { Room, Client } from 'colyseus';
import { MyRoomState, Player, Piece } from './schema/MyRoomState';

import resetPlayers from './roomFunctions/resetPlayers';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class Game extends Room<MyRoomState> {
	// default options
	maxClients = 8;
	handSize = 60;
	currentPrompt = '';
	players: IterableIterator<string> | undefined;
	started = false;

	// The channel where we register the room IDs.
	// This can be anything you want, it doesn't have to be `$mylobby`.
	LOBBY_CHANNEL = '$mylobby';

	// Generate a single 4 capital letter room ID.
	generateRoomIdSingle(): string {
		let result = '';
		for (var i = 0; i < 4; i++) {
			result += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
		}
		return result;
	}

	// 1. Get room IDs already registered with the Presence API.
	// 2. Generate room IDs until you generate one that is not already used.
	// 3. Register the new room ID with the Presence API.
	async generateRoomId(): Promise<string> {
		const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
		let id;
		do {
			id = this.generateRoomIdSingle();
		} while (currentIds.includes(id));

		await this.presence.sadd(this.LOBBY_CHANNEL, id);
		return id;
	}

	async onCreate(options: any) {
		this.roomId = await this.generateRoomId();
		console.log('Creating room', this.roomId);
		// Setting options, or leaving defaults
		this.handSize = options.handSize || this.handSize;
		this.maxClients = options.maxClients || this.maxClients;

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

		this.onMessage(
			'submitAnswer',
			(client, message: { status: string; pieces: Piece[] }) => {
				this.state.players.get(client.sessionId).status = 'finished';
				this.state.players.get(client.sessionId).submission.clear();
				message.pieces.forEach((piece) => {
					const p = new Piece(piece.word, piece.id, piece.x, piece.y);
					this.state.players.get(client.sessionId).submission.push(p);
				});
				const playersArray = Array.from(this.state.players.values());
				if (playersArray.every(({ status }) => status === 'finished')) {
					this.startShowcase();
				}
			}
		);

		this.onMessage('cancel', (client) => {
			this.state.players.get(client.sessionId).status = 'editing';
		});

		this.onMessage('advanceShowcase', () => {
			this.advanceShowcase();
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
	}

	dealHands() {
		for (let i = 0; i < this.handSize; i++) {
			this.state.players.forEach((player) => {
				let card = this.state.deck.deal();
				player.hand.push(card);
			});
		}
	}

	startShowcase() {
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
		this.resetPlayers();
		this.state.showcaseID = '';
		this.state.currentPrompt = this.state.PromptDeck.draw();
		this.state.gamePhase = 'playing';
	}

	// Can be removed soon in favor of external function
	resetPlayers() {
		this.state.players.forEach((player) => {
			for (let i = 0; i < player.submission.length; i++) {
				let pieceToRemove = player.submission.pop();
				const pieceIndex = player.hand.findIndex((pieceInHand) => {
					return pieceInHand.id === pieceToRemove.id;
				});
				player.hand.splice(pieceIndex, 1);
				const card = this.state.deck.deal();
				if (card) {
					player.hand.push(card);
				}
			}
			player.status = 'editing';
		});
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
		this.roomId = await this.generateRoomId();
		this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
		console.log('room', this.roomId, 'disposing...');
	}
}
