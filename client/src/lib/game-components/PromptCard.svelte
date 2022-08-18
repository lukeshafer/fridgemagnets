<script lang="ts">
	export let prompt: string;
</script>

<div class="card">
	<p>{prompt}</p>
</div>

<style>
	.card {
		padding: 1em;
		background-color: beige;
		border-radius: 0.5em;
		box-shadow: 0 0.25em 0.5em rgba(0, 0, 0, 0.1);
		/* margin: auto; */

		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		width: 10em;
		height: 5em;
		font-size: 1.6rem;
		font-size: calc(var(--basis) * 1.4);
	}
</style>
