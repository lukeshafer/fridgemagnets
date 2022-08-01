<script lang="ts">
	import { afterUpdate, tick } from 'svelte';
	import dragging from './stores/dragging';

	let position = 'absolute';
	dragging.subscribe((value) => {
		position = value >= 0 ? 'fixed' : 'absolute';
	});

	let deck: HTMLDivElement;
	export let right = 0;
	export let top = 0;
	export let bottom = 0;

	const getNewBounds = async () => {
		await tick();
		right = deck.getBoundingClientRect().right;
		top = deck.getBoundingClientRect().top;
		bottom = deck.getBoundingClientRect().bottom;
	};

	afterUpdate(getNewBounds);
</script>

<svelte:window on:resize={getNewBounds} />

<div class="deck" bind:this={deck} style:position>
	<slot><!-- optional fallback --></slot>
</div>

<style>
	.deck {
		overflow-x: scroll;
		padding: 15px;
		width: calc(100% - 30px);
		height: 30%;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--player-deck);
		z-index: var(--middle);

		display: flex;
		flex-flow: column wrap;
		justify-content: flex-start;
		align-items: center;
		align-content: flex-start;
		gap: 10px;
	}
</style>
