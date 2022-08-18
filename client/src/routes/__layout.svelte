<script>
	import '../app.css';
	// import 'normalize.css';
	const shuffleBackgroundColor = () => {
		const randomColor = Math.floor(Math.random() * 0xffffff);
		// set the --body-background variable to the random color
		document.documentElement.style.setProperty('--body-background', `#${randomColor.toString(16)}`);
	};
</script>

<svelte:head><title>Fridge Magnets</title></svelte:head>

<button class="btn" on:click={shuffleBackgroundColor}><span>✨</span></button>

<slot />

<style>
	button {
		position: fixed;
		top: 1rem;
		right: 1rem;
		background-color: #222;
	}

	span {
		--color: #666;
		text-shadow: 1px 1px 0px var(--color), -1px -1px 0px var(--color);
		/* text-shadow: 1px 1px 0px black, -1px -1px 0px black, 0 0 15px var(--color), 0 0 5px var(--color), */
		/* 0 0 25px var(--color), 0 0 25px var(--color), 0 0 25px var(--color), 0 0 25px var(--color); */
	}
</style>
