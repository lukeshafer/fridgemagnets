<script lang="ts">
	import { client, room, player } from '$lib/stores';

	const options = {
		name: '',
		roomcode: ''
	};

	// const joinRoom = async () => {
	// 	console.log('Joining room...');
	// 	try {
	// 		$room = await $client.join('my_room', options);
	// 		console.log($room.sessionId, 'joined', $room.name);
	// 		console.log($room);
	// 	} catch (err) {
	// 		console.log('JOIN ERROR', err);
	// 	}
	// };

	const createRoom = async () => {
		console.log('Creating room...');
		try {
			$room = await $client.joinOrCreate('lobby', options);
			// console.log($room.sessionId, 'joined', $room.name);
		} catch (err) {
			console.log('CREATE ERROR', err);
		}
	};
</script>

<h1>Ransom Notes Online</h1>

<div class="page-wrapper">
	<div class="form-wrapper">
		<h2>Join Game</h2>
		<form on:submit|preventDefault={createRoom}>
			<label for="name">Your name</label>
			<input type="text" name="Name" id="name" bind:value={options.name} required />
			<button type="submit">Join</button>
		</form>
	</div>

	<!-- <div class="form-wrapper">
		<h2>Join Existing Room</h2>
		<form on:submit|preventDefault={joinRoom}>
			<label for="name">Your name</label>
			<input type="text" name="Name" id="name" bind:value={options.name} required />
			<label for="roomcode">Room Code</label>
			<input type="text" name="Room Code" id="roomcode" bind:value={options.roomcode} required />
			<button type="submit">Join Room</button>
		</form>
	</div> -->
</div>

<style>
	.page-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.form-wrapper {
		margin: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: left;
	}

	form {
		display: flex;
		flex-direction: column;
	}

	label {
		margin-top: 10px;
	}

	form > * {
		margin-right: auto;
	}
</style>
