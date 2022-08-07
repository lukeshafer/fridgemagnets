<script lang="ts">
	import { onMount } from 'svelte';

	import GameWindow from '$lib/windows/GameWindow.svelte';
	import StartOrJoin from '$lib/windows/StartOrJoin.svelte';
	import Lobby from '$lib/windows/Lobby.svelte';

	import { client, room, gamePhase, player } from '$lib/stores';

	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	async function connect() {
		let Colyseus = await import('colyseus.js');
		$client = new Colyseus.Client('wss://gameserver.lukeshafer.net'); // or whereever your colyseus server instance is
	}

	onMount(() => {
		connect();
	});

	$: $room?.onStateChange((state) => {
		$gamePhase = state.gamePhase;
		const newPlayer = state.players.get($room.sessionId);
		if (newPlayer) {
			player.set(newPlayer);
		}
	});
</script>

{#if !$client}
	<!-- <h1>Connecting...</h1> -->
{:else if !$room}
	<div in:fade={{ delay: 300, duration: 300 }} out:fade={{ duration: 300, delay: 0 }}>
		<StartOrJoin />
	</div>
{:else if $gamePhase === 'lobby'}
	<div in:fade={{ delay: 300, duration: 300 }} out:fade={{ duration: 300, delay: 0 }}>
		<Lobby />
	</div>
{:else if $gamePhase === 'playing'}
	<div in:fade={{ delay: 300, duration: 300 }} out:fade={{ duration: 300, delay: 0 }}>
		<GameWindow />
	</div>
{/if}

<!-- This will probably have some kind of loading screen eventually -->

<!-- Once server validates connection and starts the game, we'll show the gamewindow -->

<!-- <GameWindow /> -->
