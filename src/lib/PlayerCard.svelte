<script lang="ts">
	import { readable, type Subscriber, type Readable } from 'svelte/store';

	let card: HTMLDivElement;

	interface ElementBounds {
		right: number;
		left: number;
		top: number;
		bottom: number;
	}

	export const getBounds = (): ElementBounds => {
		return {
			right: card.getBoundingClientRect().right,
			left: card.getBoundingClientRect().left,
			top: card.getBoundingClientRect().top,
			bottom: card.getBoundingClientRect().bottom
		};
	};

	export const getCard = () => card;
</script>

<!-- The Player Card -->
<!-- Any pieces on here at the end of the round are their submission -->
<!-- Those pieces are removed from the deck -->
<!-- The Card also needs to parse what the player put on it (for accessibility) -->
<!-- Best way: left-right, top-bottom -->

<div class="border">
	<div class="card" bind:this={card}>
		<slot />
	</div>
</div>

<style>
	.border {
		background: #111;
		background: linear-gradient(to right bottom, #222 0 48%, #111 50% 100%);
		width: var(--card-width);
		height: calc(var(--card-width) * 0.65);
		padding: calc(var(--card-width) / 100);

		border-radius: calc(var(--card-width) / 20);
		/*		border-width: 5px;
		border-style: solid;
		border-top-color: linear-gradient(black, white);
		border-left-color: #222;*/
	}

	.card {
		background: #181818;
		position: relative;
		width: 100%;
		height: 100%;
		border-radius: calc(var(--card-width) / 25);
		/* bottom: 30%; */
		/* left: calc(50% - var(--card-width) / 2); */
	}
</style>
