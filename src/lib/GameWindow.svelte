<script lang="ts">
	import { tick } from 'svelte';

	import Piece from './Piece.svelte';
	import type PieceType from './DrawerPiece.svelte';
	import Drawer from './Drawer.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import type PlayerCardType from './PlayerCard.svelte';
	import DrawerPiece from './DrawerPiece.svelte';
	import wordList from './data/wordlist.json';
	import PromptCard from './PromptCard.svelte';
	import DoneButton from './DoneButton.svelte';
	import { isPlayerDone } from './stores';

	let playerDeckTop: number;
	let playerCard: PlayerCardType;
	const piecesInHand: PieceType[] = [];
	let movedPieces = new Map<number, string>();
	let movedCoords = new Map<number, { x: number; y: number }>();
	const moving = { x: 0, y: 0 };
	let trash_visible = false;
	let trash_hovering = false;

	const handleDragEnd = async (pieceBottom: number, index: number) => {
		if (pieceBottom >= playerCard.getBounds().bottom - 10) {
			await tick();
			piecesInHand[index].resetPiece();
			if (movedPieces.delete(index)) {
				// Re-assigning for svelte reactivity
				movedPieces = movedPieces;
				movedCoords.delete(index);
			}
		}
	};
</script>

<!-- This is the window which contains the game elements -->
<div class="game-wrapper">
	<PromptCard prompt="egg?" />

	<PlayerCard bind:this={playerCard}>
		<div class="trash" class:trash_visible class:trash_hovering>🗑</div>
		<!-- TODO: refactor the trash into the Card itself, and move logic for it out of this -->
		{#each [...movedPieces] as [id, word] (id)}
			<Piece
				{word}
				{id}
				bounds={playerCard.getCard()}
				on:dragStart={() => {
					trash_visible = true;
				}}
				on:drag={({ detail: { bottom } }) => {
					if (bottom >= playerCard.getBounds().bottom - 10) trash_hovering = true;
					else trash_hovering = false;
				}}
				on:dragEnd={async ({ detail: { bottom } }) => {
					await handleDragEnd(bottom, id);
					trash_visible = false;
					trash_hovering = false;
				}}
			/>
		{/each}
	</PlayerCard>
	<DoneButton />
</div>

<Drawer bind:top={playerDeckTop}>
	{#each wordList as word, id}
		<DrawerPiece
			{word}
			{id}
			bind:this={piecesInHand[id]}
			on:click={({ detail: { startX, startY } }) => {
				movedCoords.set(id, { x: startX, y: startY });
				movedPieces = movedPieces.set(id, word);
			}}
		/>
	{/each}
</Drawer>

<style>
	.game-wrapper {
		display: flex;
		flex-flow: row-reverse wrap;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.trash {
		width: 100%;
		text-align: center;
		background: #ff000033;
		position: absolute;
		bottom: 0;
		visibility: hidden;
	}

	.trash_visible {
		visibility: visible;
	}

	.trash_hovering {
		background: #ff0000;
	}

	@media screen and (min-aspect-ratio: 3/2) {
		.game-wrapper {
			/* flex-direction: row; */
		}
	}
</style>
