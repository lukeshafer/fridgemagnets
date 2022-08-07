<script lang="ts">
	import { room } from '$lib/stores';
	const handleClick = () => {
		$room.send('updatePlayer', {
			status: 'editing'
		});
	};
</script>

<button class="btn" on:click={handleClick}>Wait! Not done!</button>
