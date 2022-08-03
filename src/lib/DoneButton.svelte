<script lang="ts">
	import { isPlayerDone } from './stores';
	const handleClick = () => {
		$isPlayerDone = true;
	};
</script>

<button on:click={handleClick}> I'm done! </button>
