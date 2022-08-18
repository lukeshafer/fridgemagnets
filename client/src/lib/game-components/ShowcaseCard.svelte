<script lang="ts">
	import type { Piece as PieceType } from '$lib/schema/Piece';
	import Piece from './Piece.svelte';
	export let showcase: PieceType[];

	let cardWidth: number;
	let cardHeight: number;
</script>

<div class="border">
	<div class="card">
		<div
			class="bounds"
			style="height:100%"
			bind:clientWidth={cardWidth}
			bind:clientHeight={cardHeight}
		>
			{#each showcase as { word, id, x, y }}
				<div class="piece" style="transform:translate3d({x * cardWidth}px, {y * cardHeight}px, 0)">
					<p>{word}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.border {
		background: #111;
		background: linear-gradient(to right bottom, #333 0 48%, #111 50% 100%);
		width: 25em;
		height: 15em;
		padding: 0.3em;
		position: relative;
		border-radius: 2em;
		font-size: calc(var(--basis)*0.9);
	}

	.card {
		background: #222;
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border-radius: 1.6rem;
		padding: 0.6rem;
	}

	.piece {
		position: absolute;
	}
</style>
