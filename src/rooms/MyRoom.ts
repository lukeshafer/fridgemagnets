import { Room, Client } from 'colyseus';
import { MyRoomState, Player } from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {
	onCreate(options: any) {
		this.setState(new MyRoomState());

		this.onMessage('type', (client, message) => {
			//
			// handle "type" message
			//
		});
    
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, 'joined!');

		// create Player instance
		const player = new Player();

		// place player in the map of players by its sessionId
		// (client.sessionId is unique per connection!)
		this.state.players.set(client.sessionId, player);
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.sessionId, 'left!');

		this.state.players.delete(client.sessionId);
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
	}
}
