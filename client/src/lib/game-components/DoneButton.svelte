<script lang="ts">
	import { room, playedPieces, card } from '$lib/stores';
	import { Piece } from '$lib/schema/Piece';
	const handleClick = () => {
		$room.send('submitAnswer', {
			pieces: convertCardForServer()
		});
	};

	const convertCardForServer = () => {
		const cardBounds = $card.getBoundingClientRect();
		const pieces: Piece[] = [];
		$playedPieces.forEach(({ word, position }, id) => {
			let x: number, y: number;
			if (position) {
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

	/*const parseCard = () => {*/
	/*// create array of words from playedPieces, and sort based on position*/
	/*return Array.from($playedPieces.values())*/
	/*.sort((a, b) => {*/
	/*if (a.position === undefined || b.position === undefined) {*/
	/*return 0;*/
	/*}*/
	/*return 5 * (a.position.y - b.position.y) + a.position.x - b.position.x;*/
	/*})*/
	/*.map(({ word }) => word);*/
	/*};*/
</script>

<button class="btn" on:click={handleClick}>Done! ✔️</button>

<style>
	button {
		z-index: var(--front);
	}
</style>
