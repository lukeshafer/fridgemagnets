<script lang='ts'>
	export let confirmation: any;
	$: console.log(confirmation);
</script>

<form method="post">
	<h1>Submit a new prompt!</h1>
	<textarea placeholder="Your Prompt" name="prompt" id="prompt" rows="3" cols="20" />
	<button type=submit class=btn>Submit</button>
</form>

{#if confirmation}
	<p>{confirmation}</p>
{/if}

<a href="/" class="btn">Back to the lobby</a>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 1.5rem;
	}

	textarea {
		padding: 0.5rem;
		font-size: 1.5em;
		font-family: inherit;
	}

	a {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		display: block;
		text-decoration: none;
		height: 1.5rem;

	}
</style>

