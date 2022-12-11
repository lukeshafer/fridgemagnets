import { card, playedPieces } from "./stores";
import { Piece } from "./schema/Piece";

let cardEl: HTMLDivElement;
card.subscribe((value) => cardEl = value)

let x: Map<number, pieceObj>
playedPieces.subscribe((value) => x = value)

const convertPieceForServer = (pos: DOMRect, cardBounds: DOMRect) => {
	const x = (pos.x - pos.x) / cardBounds.width;
	const y = (pos.y - pos.y) / cardBounds.height;
	return [x, y]
};

export const convertCardForServer = () => {
	const cardBounds = cardEl.getBoundingClientRect();
	const pieces: Piece[] = [];
	$playedPieces.forEach(({ word, position }, id) => {
		let x: number, y: number;
		if (position) {
			[x, y] = convertPieceForServer(position, cardBounds)
			x = (position.x - cardBounds.x) / cardBounds.width;
			y = (position.y - cardBounds.y) / cardBounds.height;
		} else {
			$playedPieces.delete(id);
			return;
		}
		const piece = new Piece();
		piece.word = word;
		piece.id = id;
		piece.x = x;
		piece.y = y;
		pieces.push(piece);
	});
	return pieces;
};
