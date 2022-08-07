import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import words from '../../data/words.json';
import prompts from '../../data/prompts.json';

export class Piece extends Schema {
	@type('string') word: string;
	@type('number') id: number;
	// maybe ID should be a string
	@type({ map: 'number' }) position = new MapSchema<number>();
}

export class Deck extends Schema {
	@type({ array: Piece }) deck = new ArraySchema<Piece>();
	constructor() {
		super();
		words.forEach((word, index) => {
			const piece = new Piece();
			piece.word = word;
			piece.id = index;
			this.deck.push(piece);
		});
		this.shuffle();
	}
	shuffle() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}
	deal() {
		console.log('Dealing a card...');
		return this.deck.shift();
	}
}

export class PromptCard extends Schema {
	@type('string') prompt: string;
	@type('number') id: number;
}

export class PromptDeck extends Schema {
	@type({ array: PromptCard }) deck = new ArraySchema<PromptCard>();
	constructor() {
		super();
		prompts.forEach((prompt, index) => {
			const promptCard = new PromptCard();
			promptCard.prompt = prompt;
			promptCard.id = index;
			this.deck.push(promptCard);
		});
		this.shuffle();
	}
	shuffle() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}
	draw() {
		console.log('Dealing a prompt...');
		return this.deck.shift();
	}
}

export class PlayerCard extends Schema {
	@type({ array: Piece }) answer = new ArraySchema<Piece>();
}

export class Player extends Schema {
	@type('string') name: string;
	@type({ array: Piece }) hand = new ArraySchema<Piece>();
	@type('boolean') isVIP: boolean = false;
	@type('string') status: 'waiting' | 'editing' | 'finished' = 'waiting';
}

export class MyRoomState extends Schema {
	@type('string') roomId: string;
	@type('string') gamePhase: 'lobby' | 'playing' = 'lobby';
	@type('number') turn: number;
	@type({ map: Player }) players = new MapSchema<Player>();
	PromptDeck = new PromptDeck();
	deck = new Deck();
	@type(PromptCard) currentPrompt: PromptCard;
}
