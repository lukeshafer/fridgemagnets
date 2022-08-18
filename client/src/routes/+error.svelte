<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let status: number = $page.status;
	let message = $page.error?.message;
	onMount(() => {
		if (status === 404) window.location.replace('/');
	});
</script>

{#if status !== 404}
	<h1>{status}</h1>
	<p>{message}</p>
{/if}
