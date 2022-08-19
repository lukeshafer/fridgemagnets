<script lang="ts">
	import { onMount } from 'svelte';

	import GameRound from '$lib/windows/GameRound.svelte';
	import MainMenu from '$lib/windows/MainMenu.svelte';
	import Lobby from '$lib/windows/Lobby.svelte';

	import { client, room, gamePhase, player } from '$lib/stores';

	import Showcase from '$lib/windows/Showcase.svelte';

	async function connect(host: string) {
		let Colyseus = await import('colyseus.js');
		$client = new Colyseus.Client(`wss://${host}`); // or whereever your colyseus server instance is

		// try reconnecting to existing game
		console.log('Client created!', $client);

		roomID = sessionStorage.getItem('roomID') || '';
		sessionID = sessionStorage.getItem('sessionID') || '';
		console.log('Room', roomID);
		console.log('Session', sessionID);
	}

	let sessionID: string;
	let roomID: string;

	const keepSessionActive = () => {
		const dt = new Date();
		if ($room?.sessionId) {
			dt.setSeconds(dt.getSeconds() + 50);
			const dtStr = dt.toISOString();
			sessionStorage.setItem('sessionExp', dtStr);
		}
		setTimeout(keepSessionActive, 2000);
	};

	keepSessionActive();

	onMount(() => {
		if (import.meta.env.DEV) connect(import.meta.env.VITE_DEV_SERVER_HOST);
		else connect(window.location.host);
		keepSessionActive();
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
