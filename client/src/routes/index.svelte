<script lang="ts">
	import { onMount } from 'svelte';

	import GameRound from '$lib/windows/GameRound.svelte';
	import MainMenu from '$lib/windows/MainMenu.svelte';
	import Lobby from '$lib/windows/Lobby.svelte';

	import { client, room, gamePhase, player } from '$lib/stores';

	/*import { fade } from 'svelte/transition';*/
	/*import { quintOut } from 'svelte/easing';*/
	import Showcase from '$lib/windows/Showcase.svelte';

	async function connect() {
		let Colyseus = await import('colyseus.js');
		$client = new Colyseus.Client('wss://gameserver.dev.lukeshafer.com'); // or whereever your colyseus server instance is
	}

	onMount(() => {
		connect();
	});

	$: $room?.onStateChange((state) => {
		$gamePhase = state.gamePhase;
		const newPlayer = state.players.get($room.sessionId);
		if (newPlayer) $player = newPlayer;
	});
</script>

{#if !$room}
	<MainMenu />
{:else if $gamePhase === 'lobby'}
	<Lobby />
{:else if $gamePhase === 'playing'}
	<GameRound />
{:else if $gamePhase === 'showcase'}
	<Showcase />
{/if}

<!-- <div in:fade={{ delay: 300, duration: 300 }} out:fade={{ duration: 300, delay: 0 }}>
	</div> -->
