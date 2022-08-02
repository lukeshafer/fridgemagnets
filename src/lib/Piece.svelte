<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import dragging from './stores/dragging';
	export let word: string;
	export let id: number;
	export let bounds: HTMLDivElement | undefined = undefined;

	const dispatch = createEventDispatcher();
</script>

<div
	class="piece"
	use:draggable={{
		onDragEnd: (data) => {
			$dragging = -1;
			dispatch('dragEnd', { bottom: data.domRect.bottom });
		},
		onDragStart: (data) => {
			$dragging = id;
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
