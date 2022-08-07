<script lang="ts">
	import type { Player } from '$lib/schema/Player';
	import { room, client, player } from '$lib/stores';

	let playerList: Map<string, Player>;

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

<h1>Hello {$player.name}!</h1>

<h2>Player List</h2>

<ul>
	{#if playerList}
		{#each [...playerList] as [key, player]}
			<li>
				<p>{player.name}</p>
				{#if player.isVIP}
					<span>⭐️</span>
				{/if}
			</li>
		{/each}
	{/if}
</ul>

<button on:click={startGame}> Start Game </button>

<style>
	/* idea: make the names in the style of traditional ransom notes - random fonts and sizes */
	ul {
		border: 1px solid black;
		background-color: white;
		max-width: 300px;
		margin: 0 auto;

		list-style-type: none;
		padding: 0;
	}

	li {
		display: flex;
		flex-direction: row;
		border: 1px solid black;
		padding-left: 10px;
	}

	p {
		margin: 10px;
	}
</style>
