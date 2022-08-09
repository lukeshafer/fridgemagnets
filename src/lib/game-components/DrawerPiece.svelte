<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// svelte-ignore unused-export-let
	export let id: number;
	export let word: string;
	const dispatch = createEventDispatcher();
	let display = 'block';
	let visibility = 'visible';
	let piece: HTMLDivElement;

	export const resetPiece = () => {
		display = 'block';
		visibility = 'visible';
	};

	const handleClick = (evt: MouseEvent) => {
		// respond to click here!
		// display = 'none';
		visibility = 'hidden';
		dispatch('click', { startX: evt.screenX, startY: evt.screenY });
	};
</script>

<div on:click={handleClick} bind:this={piece} style:display style:visibility class="piece">
	<p>{word}</p>
</div>

<style>
	div.piece {
		font-size: 16px;
	}
</style>
