<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	export let word: string;
	export let id: number;
	export let bounds: HTMLDivElement | undefined = undefined;

	const dispatch = createEventDispatcher();
	let position = 'absolute' as 'static' | 'absolute';
</script>

<div
	style:position
	class="piece"
	use:draggable={{
		onDragEnd: (data) => {
			dispatch('dragEnd', { bottom: data.domRect.bottom });
			position = 'absolute';
		},
		onDragStart: (data) => {
			dispatch('dragStart');
		},
		onDrag: (data) => {
			dispatch('drag', { bottom: data.domRect.bottom });
		},
		bounds
	}}
>
	<span />
	<p>{word}</p>
</div>

<style>
	span {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
