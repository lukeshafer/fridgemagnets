<script lang="ts">
	import PromptCard from '$lib/game-components/PromptCard.svelte';
	import ShowcaseCard from '$lib/game-components/ShowcaseCard.svelte';
	import { room, playedPieces, player } from '$lib/stores';
	$playedPieces.clear();
	let showcaseID = $room.state.showcaseID;
	$: showcasePlayer = $room.state.players.get(showcaseID);

	$room.onStateChange((state) => {
		showcaseID = state.showcaseID;
		const newPlayer = state.players.get($room.sessionId)
		if (newPlayer)
			$player = newPlayer
	});
	
	let timeout = false;
	setTimeout(()=> timeout = true, 10000)
	
</script>

<div>
	{#if showcasePlayer?.submission}
		<h2>{showcasePlayer.name}</h2>
		<div class="cards">
			<ShowcaseCard showcase={showcasePlayer.submission} />
			<PromptCard prompt={$room.state.currentPrompt.prompt} />
		</div>
		{#key $player.isVIP}
			{#if $player.isVIP || timeout}<button class="btn" on:click={() => $room.send('advanceShowcase')}> Next</button>
			{:else}<p>Waiting on host....</p>
			{/if}
		{/key}
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
	
	.cards {
		flex-direction: row;
		width: 100%;
	}
</style>
