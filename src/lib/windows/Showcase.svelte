<script lang="ts">
	import PromptCard from '$lib/game-components/PromptCard.svelte';
	import ShowcaseCard from '$lib/game-components/ShowcaseCard.svelte';
	import { room, playedPieces } from '$lib/stores';
	$playedPieces.clear();
	let showcaseID = $room.state.showcaseID;
	$: showcasePlayer = $room.state.players.get(showcaseID);

	$room.onStateChange((state) => {
		showcaseID = state.showcaseID;
	});
</script>

{#if showcasePlayer?.submission}
	<h2>{showcasePlayer.name}</h2>
	<ShowcaseCard showcase={showcasePlayer.submission} />
	<PromptCard prompt={$room.state.currentPrompt.prompt} />
	<button on:click={() => $room.send('advanceShowcase')}>Advance</button>
{/if}
