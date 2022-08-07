<script lang="ts">
	import { room } from '$lib/stores';
	const handleClick = () => {
		$room.send('updatePlayer', {
			status: 'finished'
		});
	};
</script>

<button class="btn" on:click={handleClick}> I'm done! </button>
