<script lang="ts">
	import Drawer from './Drawer.svelte';
	import PlayerCard from './PlayerCard.svelte';
	import DrawerPiece from './DrawerPiece.svelte';
	import PromptCard from './PromptCard.svelte';
	import DoneButton from './DoneButton.svelte';
	import { movedPieces, wordList, promptList, piecesInHand } from './stores';

	let currentPrompt = $promptList.at(Math.floor(Math.random() * $promptList.length));
</script>

<!-- This is the window which contains the game elements -->
<div class="game-wrapper">
	<PromptCard prompt={currentPrompt || ''} />
	<PlayerCard />
	<DoneButton />
</div>

<Drawer>
	{#each $wordList as word, id}
		<DrawerPiece
			{word}
			{id}
			bind:this={piecesInHand[id]}
			on:click={() => {
				$movedPieces = $movedPieces.set(id, word);
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
</style>
