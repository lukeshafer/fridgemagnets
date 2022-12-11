<script lang="ts">
	import Piece from '$lib/game-components/Piece.svelte';
	import { Piece as PieceClass } from '$lib/schema/Piece';
	import { playedPieces, piecesInHand, player, card, room } from '$lib/stores';

	let trash: HTMLDivElement;
	$: trashBounds = trash?.getBoundingClientRect();

	let trash_visible = false;
	let trash_hovering = false;

	$: disabled = $player.status === 'finished';

	const isOverlapping = (a: DOMRect, b: DOMRect) => {
		if (!(a.top > b.bottom || a.right < b.left || a.bottom < b.top || a.left > b.right)) {
			// console log which sides are overlapping
			const overlappingPortions = {
				top: a.top < b.top ? a.bottom - b.top : 0,
				right: a.right > b.right ? b.right - a.left : 0,
				bottom: a.bottom > b.bottom ? b.bottom - a.top : 0,
				left: a.left < b.left ? a.right - b.left : 0
			};
		}

		return !(a.top > b.bottom || a.right < b.left || a.bottom < b.top || a.left > b.right);
	};

	const convertCardForServer = () => {
		const cardBounds = $card.getBoundingClientRect();
		const pieces: PieceClass[] = [];
		$playedPieces.forEach(({ word, position }, id) => {
			let x: number, y: number;
			if (position) {
				x = (position.x - cardBounds.x) / cardBounds.width;
				y = (position.y - cardBounds.y) / cardBounds.height;
			} else {
				$playedPieces.delete(id);
				return;
			}
			const piece = new PieceClass();
			piece.word = word;
			piece.id = id;
			piece.x = x;
			piece.y = y;
			pieces.push(piece);
		});
		return pieces;
	};

	const handleDragEnd = async (pieceRect: DOMRect, id: number, word: string) => {
		if (isOverlapping(pieceRect, trashBounds)) {
			piecesInHand[id].resetPiece();
			$playedPieces.delete(id);
		} else {
			handlePieceOverlap(pieceRect, id, word);
		}
	};

	const handlePieceOverlap = (pieceRect: DOMRect, id: number, word: string) => {
		$playedPieces.forEach(({ position }, key) => {
			if (key !== id && position && isOverlapping(pieceRect, position)) {
				// move piece out of the way
			}
		});
		$playedPieces.set(id, {
			word,
			position: pieceRect
		});
	};
</script>

<!-- The Player Card -->
<!-- Any pieces on here at the end of the round are their submission -->
<!-- Those pieces are removed from the deck -->
<!-- The Card also needs to parse what the player put on it (for accessibility) -->
<!-- Best way: left-right, top-bottom -->

<div class="border">
	<div class="card">
		<div class="bounds" bind:this={$card} style="height: 100%;">
			<!-- Trash Can for deleting pieces -->
			<div class="trash" class:trash_visible class:trash_hovering bind:this={trash}>🗑</div>
			<!-- List of pieces on the card -->
			{#each [...$playedPieces] as [id, { word }] (id)}
				{@const width = $card.getBoundingClientRect().width}
				{@const height = $card.getBoundingClientRect().height}
				{@const maxX = width * (1 - (word.length + 1) * 0.05) }
				{@const maxY = height * 0.85 }
				{@const x = Math.floor(Math.random() * maxX)}
				{@const y = Math.floor(Math.random() * maxY)}
				<Piece
					{word}
					{id}
					{disabled}
					{x}
					{y}
					on:dragStart={() => {
						trash_visible = true;
					}}
					on:drag={({ detail: { rect: pieceRect } }) => {
						trash_hovering = isOverlapping(pieceRect, trashBounds);
					}}
					on:dragEnd={async ({ detail: { rect: pieceRect } }) => {
						await handleDragEnd(pieceRect, id, word);
						trash_visible = false;
						trash_hovering = false;
						
						// Send the piece info to the server immediately
						$room.send('updateCard', {
							pieces: convertCardForServer()
						});
					}}
				/>
			{/each}
			{#if $player.status === 'finished'}
				<div class="disabled-overlay" />
			{/if}
		</div>
	</div>
</div>

<style>
	.border {
		background: #111;
		background: linear-gradient(to right bottom, #333 0 48%, #111 50% 100%);
		width: 25em;
		height: 15em;
		padding: 0.3em;
		position: relative;
		border-radius: 2em;
		font-size: var(--basis);
	}

	.card {
		background: #222;
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border-radius: 1.6em;
		padding: 0.6em;
	}

	.bounds {
		position: relative;
	}

	.trash {
		font-size: 0.7em;
		height: 1.5em;
		padding: 0.2em;
		text-align: center;
		background: #ff000033;
		position: absolute;
		top: 0;
		right: 0;
		visibility: hidden;
	}

	.trash_visible {
		visibility: visible;
	}

	.trash_hovering {
		background: #ff0000;
	}

	.disabled-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: var(--front);
		top: 0;
		left: 0;
		border-radius: 1.3em;
		background: #000;
		opacity: 0.5;
	}
</style>
