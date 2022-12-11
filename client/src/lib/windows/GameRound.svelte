<script lang="ts">
	import Drawer from '$lib/game-components/Drawer.svelte';
	import PlayerCard from '$lib/game-components/PlayerCard.svelte';
	import DrawerPiece from '$lib/game-components/DrawerPiece.svelte';
	import PromptCard from '$lib/game-components/PromptCard.svelte';
	import DoneButton from '$lib/game-components/DoneButton.svelte';
	import EditButton from '$lib/game-components/EditButton.svelte';
	import { playedPieces, piecesInHand, player, room } from '$lib/stores';
	import { onMount } from 'svelte';

	$: currentPrompt = $room.state.currentPrompt.prompt;
	let hand = $player.hand;

	$room.onStateChange((state) => {
		hand = $player.hand;
	});

	let timer = 1;
	const advanceTimer = () => {
		timer = timer - 1;
	};

	onMount(() => {
    const counter = setInterval(advanceTimer, 1000)
    setTimeout(() => {
      
    }, 90000)
  });
</script>

{#key timer}
	<span class="timer">{timer}</span>
{/key}

<!-- This is the window which contains the game elements -->
<div class="game-wrapper">
	<PromptCard prompt={currentPrompt || ''} />
	<PlayerCard />

	<div class="buttons">
		{#if $player.status === 'editing'}
			<DoneButton />
		{:else if $player.status === 'finished'}
			<EditButton />
		{/if}
	</div>
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
		height: 70vh;
	}

	.buttons {
		width: 100%;
		max-width: 30rem;
		/* position: absolute;
		left: 1rem;
		bottom: 1rem; */
	}

	.timer {
		font-size: 1.5rem;
	}
</style>
