<script lang="ts">
	import { client, room } from '$lib/stores';
	import { onMount } from 'svelte';

	let name: string;
	let roomcode: string;

	let errorText = '';

	const btns: HTMLButtonElement[] = [];

	onMount(() => {
		btns.map((btn) => btn.disabled);
	});

	const roomHandler = async (command: 'joinPublic' | 'createPrivate' | 'joinPrivate') => {
		console.log(`Command ${command} called`);
		btns.map((btn) => btn.disabled);
		if (!name) {
			alert('Name is required!');
			return;
		}
		try {
			switch (command) {
				case 'joinPublic':
					$room = await $client.joinOrCreate('lobby', { name });
					console.log($room.sessionId, 'joined', $room.name);
					break;
				case 'createPrivate':
					$room = await $client.create('lobby', { name, private: true });
					console.log($room.sessionId, 'created', $room.name);
				case 'joinPrivate':
					if (roomcode) {
						$room = await $client.joinById(roomcode, { name });
						console.log($room.sessionId, 'joined', $room.name);
					} else alert('Room code is required!');
					break;
				default:
					alert("This shouldn't happen!");
					break;
			}
		} catch (err) {
			console.log('ROOM ERROR', err);
			errorText = 'SERVER ERROR. If this is not expected, please reach out to Luke!';
		}
	};
</script>

<div class="page-wrapper">
	<form action="" on:submit|preventDefault>
		<div class="name-wrapper">
			<h1 class="title"><span>Fridge</span> <span>Magnets</span></h1>
		</div>
		<div class="buttons" style:visibility={$client ? 'visible' : 'hidden'}>
			<input
				type="text"
				class="piece"
				name="name"
				id="name"
				bind:value={name}
				placeholder="Your Name"
				required
			/>
			<div class="button-wrapper">
				<button
					class="btn"
					bind:this={btns[btns.length]}
					on:click={() => roomHandler('createPrivate')}>Create Room</button
				>
			</div>
			<div class="button-wrapper roomcode-wrapper">
				<input
					type="text"
					class="piece"
					name="roomcode"
					id="roomcode"
					bind:value={roomcode}
					placeholder="Room Code"
				/>
				<button
					class="btn"
					bind:this={btns[btns.length]}
					on:click={() => roomHandler('joinPrivate')}>Join Room</button
				>
				<p>{errorText}</p>
			</div>
		</div>
	</form>
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
	form {
		margin: 2rem 0;
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		gap: 2rem;

		grid-template-columns: repeat(auto-fit, min(30rem, 80vw));
		grid-template-rows: auto;
		place-items: center;
	}

	.name-wrapper {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		gap: 3rem;
	}

	h1 {
		margin: 0;
	}

	input {
		width: min(10rem, 100%);
		text-align: center;
	}

	.roomcode-wrapper {
		margin-top: 2em;
	}

	#roomcode {
		width: 8.5rem;
		text-transform: uppercase;
	}

	.buttons {
		display: flex;
		flex-flow: column;
		align-items: center;
		justify-content: center;
		text-align: left;
		gap: 1rem;
		max-width: 90vw;
		padding: 0.5rem;
	}

	.button-wrapper {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.button-wrapper > p {
		color: red;
		font-size: 12px;
	}

	a.btn {
		width: fit-content;
	}
</style>
