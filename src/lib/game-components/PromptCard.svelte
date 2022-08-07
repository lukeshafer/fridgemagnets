<script lang="ts">
	export let prompt: string;
</script>

<div class="card">
	<p>{prompt}</p>
</div>

<style>
	.card {
		padding: 1rem;
		background-color: beige;
		border-radius: 0.5rem;
		box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
		/* margin: auto; */

		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;

		width: 21rem;
		height: 12rem;
		font-size: 1.6rem;
	}
</style>
