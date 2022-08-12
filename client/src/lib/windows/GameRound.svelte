<script lang="ts">
	import Drawer from '$lib/game-components/Drawer.svelte';
	import PlayerCard from '$lib/game-components/PlayerCard.svelte';
	import DrawerPiece from '$lib/game-components/DrawerPiece.svelte';
	import PromptCard from '$lib/game-components/PromptCard.svelte';
	import DoneButton from '$lib/game-components/DoneButton.svelte';
	import EditButton from '$lib/game-components/EditButton.svelte';
	import { playedPieces, piecesInHand, player, room } from '$lib/stores';

	$: currentPrompt = $room.state.currentPrompt.prompt;
	let hand = $player.hand;

	$room.onStateChange((state) => {
		hand = $player.hand;
		hand.forEach((piece) => {
			// console.log(piece.word);
		});
	});
</script>

<!-- This is the window which contains the game elements -->
<div class="game-wrapper">
	<PromptCard prompt={currentPrompt || ''} />
	<PlayerCard />
</div>

<div class="buttons">
	{#if $player.status === 'editing'}
		<DoneButton />
	{:else if $player.status === 'finished'}
		<EditButton />
	{/if}
</div>

<Drawer>
	{#each hand as { word, id }}
		<DrawerPiece
			{word}
			{id}
			bind:this={piecesInHand[id]}
			on:click={() => {
				$playedPieces = $playedPieces.set(id, { word, position: undefined });
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
		height: 80vh;
	}

	.buttons {
		position: absolute;
		left: 1rem;
		bottom: 1rem;
	}
</style>
