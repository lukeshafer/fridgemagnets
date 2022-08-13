<script lang="ts">
	import PromptCard from '$lib/game-components/PromptCard.svelte';
	import ShowcaseCard from '$lib/game-components/ShowcaseCard.svelte';
	import { room, playedPieces, player } from '$lib/stores';
	$playedPieces.clear();
	let showcaseID = $room.state.showcaseID;
	$: showcasePlayer = $room.state.players.get(showcaseID);

	$room.onStateChange((state) => {
		showcaseID = state.showcaseID;
	});
</script>
<div>
	
	{#if showcasePlayer?.submission}
		<h2>{showcasePlayer.name}</h2>
		<ShowcaseCard showcase={showcasePlayer.submission} />
		<PromptCard prompt={$room.state.currentPrompt.prompt} />
		{#if $player.isVIP}<button class='btn' on:click={() => $room.send('advanceShowcase')}>Advance</button>
		{:else}<p >Waiting on host....</p>
		{/if}
	{/if}
	
</div>
<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap:1rem;
	}
</style>
