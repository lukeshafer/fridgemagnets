<script lang="ts">
	import Piece from './Piece.svelte';
	import { movedPieces, piecesInHand } from './stores';

	let card: HTMLDivElement;
	let trash: HTMLDivElement;
	export const getCard = () => card;
	$: trashBounds = trash?.getBoundingClientRect();

	let trash_visible = false;
	let trash_hovering = false;

	const isOverlapping = (a: DOMRect, b: DOMRect) => {
		return !(a.top > b.bottom || a.right < b.left || a.bottom < b.top || a.left > b.right);
	};

	const handleDragEnd = async (pieceRect: DOMRect, index: number) => {
		if (isOverlapping(pieceRect, trashBounds)) {
			piecesInHand[index].resetPiece();
			$movedPieces.delete(index);
		}
	};
</script>

<!-- The Player Card -->
<!-- Any pieces on here at the end of the round are their submission -->
<!-- Those pieces are removed from the deck -->
<!-- The Card also needs to parse what the player put on it (for accessibility) -->
<!-- Best way: left-right, top-bottom -->

<div class="border">
	<div class="card" bind:this={card}>
		<!-- Trash Can for deleting pieces -->
		<div class="trash" class:trash_visible class:trash_hovering bind:this={trash}>🗑</div>
		<!-- List of pieces on the card -->
		{#each [...$movedPieces] as [id, word] (id)}
			<Piece
				{word}
				{id}
				bounds={card}
				on:dragStart={() => {
					trash_visible = true;
				}}
				on:drag={({ detail: { rect: pieceRect } }) => {
					trash_hovering = isOverlapping(pieceRect, trashBounds);
				}}
				on:dragEnd={async ({ detail: { rect: pieceRect } }) => {
					await handleDragEnd(pieceRect, id);
					trash_visible = false;
					trash_hovering = false;
				}}
			/>
		{/each}
	</div>
</div>

<style>
	.border {
		font-size: calc(var(--card-width) / 100);
		background: #111;
		background: linear-gradient(to right bottom, #333 0 48%, #111 50% 100%);
		width: 100em;
		height: 65em;
		padding: 1em;

		border-radius: 5em;
	}

	.card {
		background: #222;
		position: relative;
		width: calc(100%);
		height: 100%;
		box-sizing: border-box;
		border-radius: 4em;
		padding: 2em;
	}

	.trash {
		font-size: 5em;
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
</style>
