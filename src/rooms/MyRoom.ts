import { Room, Client } from 'colyseus';
import { MyRoomState, Player } from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {
	// default options
	maxClients = 6;
	handSize = 25;
	currentPrompt = '';

	onCreate(options: any) {
		// Setting options, or leaving defaults
		this.handSize = options.handSize || this.handSize;
		this.maxClients = options.maxClients || this.maxClients;

		this.setState(new MyRoomState());

		console.log('room', this.roomId, 'created!', options);

		this.onMessage('start', (client, message) => {
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

		this.onMessage('updatePlayer', (client, message) => {
			if (message.status) {
				this.state.players.get(client.sessionId).status = message.status;
			}
		});
	}

	startGame() {
		this.lock();
		this.state.deck.shuffle();
		this.dealHands();
		this.state.gamePhase = 'playing';
		this.state.players.forEach((player) => {
			player.status = 'editing';
		});
		this.state.currentPrompt = this.state.PromptDeck.draw();
	}

	dealHands() {
		for (let i = 0; i < this.handSize; i++) {
			this.state.players.forEach((player) => {
				let card = this.state.deck.deal();
				player.hand.push(card);
			});
		}
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
