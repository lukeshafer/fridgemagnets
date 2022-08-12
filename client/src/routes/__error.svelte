<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ error, status }) => {
		return {
			props: {
				status,
				message: error?.message
			}
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	export let status: number, message: string;
	onMount(() => {
		if (status === 404) window.location.replace('/');
	});
</script>

{#if status !== 404}
	<h1>{status}</h1>
	<p>{message}</p>
{/if}
