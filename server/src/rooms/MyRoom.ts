import { Room, Client } from 'colyseus';
import { MyRoomState, Player, Piece } from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {
	// default options
	maxClients = 6;
	handSize = 70;
	currentPrompt = '';
	players: IterableIterator<string> | undefined;

	onCreate(options: any) {
		console.log('Creating room', this.roomId);
		// Setting options, or leaving defaults
		this.handSize = options.handSize || this.handSize;
		this.maxClients = options.maxClients || this.maxClients;

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

		// place player in the map of players by its sessionId
		// (client.sessionId is unique per connection!)
		this.state.players.set(client.sessionId, player);
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.sessionId, 'left!');
		console.log('consented:', consented);

		// if player is VIP, assign new VIP
		if (this.state.players.get(client.sessionId).isVIP) {
			[...this.state.players][1][1].isVIP = true;
		}

		this.state.players.delete(client.sessionId);
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
	}
}
