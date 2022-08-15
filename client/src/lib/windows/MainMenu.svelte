<script lang="ts">
	import { client, room, } from '$lib/stores';
	import { onMount } from 'svelte';

	const options = {
		name: '',
		roomcode: ''
	};

	let btn: HTMLButtonElement;
	let errorText = '';

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
			errorText =
				'ERROR: Server is currently offline. If this is not expected, please reach out to Luke!';
		}
	};
</script>

<div class="page-wrapper">
	<h1 class="title"><span>Fridge</span> <span>Magnets</span></h1>
		<div class="form-wrapper" style:visibility={$client ? 'visible' : 'hidden'}>
			<form on:submit|preventDefault={createRoom} autocomplete="off">
				<label for="name">Your name</label>
				<input type="text" class="piece" name="Name" id="name" bind:value={options.name} required />
				<div class="button-wrapper">
					<button type="submit" class="btn" bind:this={btn}>Join</button>
					<p>{errorText}</p>
				</div>
			</form>
		</div>
</div>

<a href="https://docs.google.com/forms/d/e/1FAIpQLSdlhgBV4yFDX9EOCz3MMpT3OC3TL-ArnXbp8F8i0xm76k9OuA/viewform?usp=sf_link" target="_blank" class="btn">Suggest a prompt!</a>

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

	.button-wrapper {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.button-wrapper > p {
		color: red;
		font-size: 12px;
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
</style>
