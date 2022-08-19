<script lang="ts">
	import { room, client } from '$lib/stores';
	import { onMount } from 'svelte';

	let name: string;
	let roomID: string;
	let oldRoomID: string;
	let oldSessionID: string;
	let oldSessionExp: Date;
	let isSessionValid: boolean;

	let errorText = '';

	onMount(async () => {
		name = sessionStorage.getItem('name') || '';
		oldRoomID = sessionStorage.getItem('roomID') || '';
		oldSessionID = sessionStorage.getItem('sessionID') || '';
		oldSessionExp = new Date(sessionStorage.getItem('sessionExp') || '');

		if (oldSessionExp < new Date()) oldRoomID = '';
	});

	const checkIfSessionActive = () => {
		if (oldSessionExp < new Date()) {
			isSessionValid = false;
		} else {
			isSessionValid = true;
			setTimeout(checkIfSessionActive, 2000);
		}
	};

	checkIfSessionActive();

	$: if (roomID?.length > 4) {
		roomID = roomID.substring(0, 4);
	}

	$: name = name?.replaceAll(/[;=]/g, '');
	$: roomID = roomID?.toUpperCase();
	$: roomID = roomID?.replaceAll(/[^A-Z]/g, '');

	const joinRoom = async () => {
		sessionStorage.setItem('name', name);
		try {
			$room = await $client.joinById(roomID, { name });
			console.log($room.sessionId, 'joined', $room.name);
		} catch (err) {
			console.log('JOIN ERROR', err);
		}
	};

	const createRoom = async () => {
		sessionStorage.setItem('name', name);
		try {
			$room = await $client.create('lobby', { name, private: true });
			console.log($room.sessionId, 'created', $room.name);
		} catch (err) {
			console.log('CREATE ERROR', err);
		}
	};

	const tryRejoining = async () => {
		try {
			$room = await $client.reconnect(oldRoomID, oldSessionID);
		} catch (err) {
			console.log('ERROR REJOINING', err);
		}
	};
</script>

<div class="page-wrapper">
	<h1 class="title"><span>Fridge</span> <span>Magnets</span></h1>
	<div class="buttons" style:visibility={$client ? 'visible' : 'hidden'}>
		<div method="post" class="form create">
			<input
				type="text"
				class="piece"
				id="name"
				bind:value={name}
				placeholder="Your Name"
				required
			/>
			<button on:click={createRoom} class="btn">Create Room</button>
		</div>
		<div class="form">
			<input type="text" bind:value={name} hidden aria-hidden="true" required />
			<input
				type="text"
				class="piece"
				id="roomID"
				bind:value={roomID}
				placeholder="Room Code"
				required
			/>
			<button on:click={joinRoom} class="btn">Join Room</button>
			<!-- <a href="/room/{roomID}" class="btn" disabled={roomID?.length < 4}>Join Room</a> -->
			<p class="error">{errorText}</p>
		</div>
		{#key isSessionValid}
			{#if oldSessionID && isSessionValid}
				<button on:click={tryRejoining} class="btn">Re-join disconnected game</button>
			{/if}
		{/key}
	</div>
</div>

<a
	href="https://docs.google.com/forms/d/e/1FAIpQLSdlhgBV4yFDX9EOCz3MMpT3OC3TL-ArnXbp8F8i0xm76k9OuA/viewform?usp=sf_link"
	target="_blank"
	class="btn">Suggest <br />a prompt!</a
>

<style>
	:global(body) {
		overflow-y: scroll;
	}
	.page-wrapper {
		margin: 2rem 0;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		min-height: 62vh;
		gap: 2rem;

		grid-template-columns: repeat(auto-fit, min(30rem, 80vw));
		grid-template-rows: auto;
		place-items: center;
	}

	.form {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: center;
	}

	.form.create {
		flex-direction: column;
	}

	h1 {
		margin: 0;
	}

	input {
		width: min(10rem, 100%);
		text-align: center;
	}

	#roomID {
		width: 8.5rem;
		text-transform: uppercase;
	}

	.buttons {
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
		text-align: left;
		gap: 3rem;
		max-width: 90vw;
		padding: 0.5rem;
	}

	p.error {
		color: red;
		font-size: 12px;
	}

	a.btn {
		width: fit-content;
	}
</style>
