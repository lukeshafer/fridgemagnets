<script lang="ts">
	import { room } from '$lib/stores';
	const handleClick = () => {
		$room.send('cancel');
	};
</script>

<button class="btn" on:click={handleClick}>Edit ✏️</button>
