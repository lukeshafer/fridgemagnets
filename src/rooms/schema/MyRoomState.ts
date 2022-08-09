import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import words from '../../data/words.json';
import prompts from '../../data/prompts.json';

export class Piece extends Schema {
	constructor(word: string, id: number, x: number = 0, y: number = 0) {
		super();
		this.word = word;
		this.id = id;
		this.x = x;
		this.y = y;
	}
	@type('string') word: string;
	@type('number') id: number;
	@type('number') x: number;
	@type('number') y: number;
}

class Deck {
	deck: Piece[] = [];
	constructor() {
		words.forEach((word, index) => {
			const piece = new Piece(word, index);
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
		return this.deck.shift();
	}
}

export class PromptCard extends Schema {
	@type('string') prompt: string;
	@type('number') id: number;
}

class PromptDeck extends Schema {
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
		return this.deck.shift();
	}
}

const PLAYER_STATUS = ['editing', 'waiting', 'finished'] as const;
type PlayerStatus = typeof PLAYER_STATUS[number];
export function isPlayerStatus(input: string): input is PlayerStatus {
	return PLAYER_STATUS.includes(input as PlayerStatus);
}

export class Player extends Schema {
	@type('string') name: string;
	@type({ array: Piece }) hand = new ArraySchema<Piece>();
	@type('boolean') isVIP: boolean = false;
	@type('string') status: PlayerStatus = 'waiting';
	@type({ array: Piece }) submission = new ArraySchema<Piece>();
}

export class MyRoomState extends Schema {
	@type('string') roomId: string;
	@type('string') gamePhase: 'lobby' | 'playing' | 'showcase' | 'resetting' =
		'lobby';
	@type('number') turn: number;
	@type({ map: Player }) players = new MapSchema<Player>();
	PromptDeck = new PromptDeck();
	deck = new Deck();
	@type(PromptCard) currentPrompt: PromptCard;
	@type('string') showcaseID: string;
}
