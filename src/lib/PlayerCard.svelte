<script lang="ts">
	let card: HTMLDivElement;
	/*$: bounds = {
		right = card?.getBoundingClientRect().right;
		left = card?.getBoundingClientRect().left;
		top = card?.getBoundingClientRect().top;
		bottom = card?.getBoundingClientRect().bottom;
	}*/
	let right: number;
	let left: number;
	let top: number;
	let bottom: number;

	$: if (card) {
		right = card.getBoundingClientRect().right;
		left = card.getBoundingClientRect().left;
		top = card.getBoundingClientRect().top;
		bottom = card.getBoundingClientRect().bottom;
	}

	export const getBounds = () => {
		return {
			right,
			left,
			top,
			bottom
		};
	};

	export const getCard = () => card;
</script>

<!-- The Player Card -->
<!-- Any pieces on here at the end of the round are their submission -->
<!-- Those pieces are removed from the deck -->
<!-- The Card also needs to parse what the player put on it (for accessibility) -->
<!-- Best way: left-right, top-bottom -->

<div bind:this={card}>
	<slot />
</div>

<style>
	div {
		background: #444;
		position: absolute;
		width: var(--card-width);
		height: calc(var(--card-width) * 0.75);
		bottom: 30%;
		left: calc(50% - var(--card-width) / 2);
	}
</style>
