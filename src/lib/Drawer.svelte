<script lang="ts">
	import { afterUpdate, tick } from 'svelte';
	import dragging from './stores/dragging';

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

	let open = false;

	const toggleDrawer = () => {
		open = !open;
	};

	afterUpdate(getNewBounds);
</script>

<svelte:window on:resize={getNewBounds} />

<div class="wrapper" class:open>
	<button class="btn" on:click={toggleDrawer}><span>▲</span></button>
	<div class="deck" bind:this={deck}>
		<slot><!-- optional fallback --></slot>
	</div>
</div>

<style>
	.wrapper {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50vh;

		display: flex;
		flex-direction: column;
		align-items: center;
		transition: transform 200ms;
		gap: 10px;
	}

	.deck {
		/* margin-top: 50px; */
		scroll-behavior: smooth;
		overflow-x: scroll;
		--padding: 20px;
		padding: var(--padding);
		width: calc(100% - var(--padding) * 2);
		max-width: 500px;
		/* left: 0; */
		/* right: 0; */
		background: var(--player-deck);
		z-index: var(--middle);

		display: flex;
		flex-flow: column wrap;
		justify-content: flex-start;
		align-items: center;
		align-content: flex-start;
		gap: 10px;
	}

	.open {
		transform: translate3d(0, calc(50vh - 50px), 0);
	}

	button span {
		transform: rotate(180deg);
	}

	.open span {
		transform: rotate(0deg);
	}
</style>
