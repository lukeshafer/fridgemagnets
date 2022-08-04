import {
	Schema,
	Context,
	type,
	MapSchema,
	ArraySchema,
} from '@colyseus/schema';

export class Piece extends Schema {
	@type('string') word: string;
	@type('number') id: number;
	// maybe ID should be a string
	@type({ map: 'number' }) position = new MapSchema<number>();
}

export class Deck extends Schema {
	@type({ array: Piece }) deck = new ArraySchema<Piece>();
	shuffle() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}
}

export class PlayerCard extends Schema {
	@type({ array: Piece }) answer = new ArraySchema<Piece>();
}

export class Player extends Schema {
	@type('string') name: string;
	@type('number') id: number;
	@type('string') userID: string;
	@type({ array: Piece }) hand = new ArraySchema<Piece>();
}

export class MyRoomState extends Schema {
	@type('string') mySynchronizedProperty: string = 'Hello world';
	@type({ map: Player }) players = new MapSchema<Player>();
	// @type({ map: Piece }) deck = new MapSchema<Piece>();
  @type(Deck) deck = new Deck();
}
