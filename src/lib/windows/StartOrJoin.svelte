<script lang="ts">
	import { client, room, player } from '$lib/stores';
	import { onMount } from 'svelte';

	const options = {
		name: '',
		roomcode: ''
	};

	let btn: HTMLButtonElement;

	onMount(() => {
		btn.disabled = false;
	});

	const createRoom = async () => {
		console.log('Creating room...');
		btn.disabled = true;
		try {
			// debugger;
			$room = await $client.joinOrCreate('lobby', options);
			console.log($room.sessionId, 'joined', $room.name);
		} catch (err) {
			console.log('CREATE ERROR', err);
		}
	};
</script>

<div class="page-wrapper">
	<h1 class="title">Ransom Notes Online</h1>
	<div class="form-wrapper" style:visibility={$client ? 'visible' : 'hidden'}>
		<form on:submit|preventDefault={createRoom}>
			<label for="name">Your name</label>
			<input type="text" class="piece" name="Name" id="name" bind:value={options.name} required />
			<button type="submit" class="btn" bind:this={btn}>Join</button>
		</form>
	</div>
</div>

<a href="/submit" class="btn">Submit a prompt suggestion!</a>

<style>
	.page-wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
	}

	.form-wrapper {
		font-size: 1.5rem;
		margin: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: left;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: left;
		gap: 0.5rem;
		max-width: 90vw;
	}


	label {
		margin-top: 10px;
	}

	form > * {
		margin-right: auto;
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
