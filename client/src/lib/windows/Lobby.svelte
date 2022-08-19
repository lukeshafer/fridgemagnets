<script lang="ts">
	import { room, player } from '$lib/stores';

	let playerList = $room.state.players;

	sessionStorage.setItem('roomID', $room.id);
	sessionStorage.setItem('sessionID', $room.sessionId);

	$room.onStateChange((state) => {
		playerList = state.players;
	});

	const startGame = async () => {
		console.log('Starting game...');
		try {
			$room.send('start');
		} catch (err) {
			console.log('START ERROR', err);
		}
	};
</script>

<div class="outer">
	<h1>
		<span>Hello</span> <div class=name><span style:background-color="white">{$player.name}</span><span>!</span></div>
	</h1>
	<h2>Room Code: {$room.id}</h2>

	<div class="inner">
		{#if $player.isVIP}<button class="btn first-child" on:click={startGame}> Start Game </button>
		{:else}<p class="first-child">Waiting for host to start game...</p>
		{/if}

		<ul>
			<h2>Players</h2>
			{#if playerList}
				{#each [...playerList] as [_key, player]}
					<li class="piece" style:margin-left="{Math.random() * 100}px">
						<p>{player.name}</p>
						{#if player.isVIP}
							<span>⭐️</span>
						{/if}
					</li>
				{/each}
			{/if}
		</ul>
	</div>
</div>

<style>
	div.outer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	div.inner {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		gap: 1em;
	}

	div.name {
		background: none;
		border: none;
		box-shadow: none;
		display: flex;
		gap: 1rem;
	}

	/* idea: make the names in the style of traditional ransom notes - random fonts and sizes */
	ul {
		margin: 0 auto;
		width: min(25rem, 90vw);
		padding: 1rem;
		background-color: var(--card-background);

		list-style-type: none;

		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	ul > h2 {
		margin: 0;
	}

	li {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	p {
		margin: 10px;
		font-size: 1.3rem;
	}

	button {
		/* height: min-content; */
		align-self: center;
	}

	.first-child {
		width: 10rem;
		align-self: center;
	}
</style>
