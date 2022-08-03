<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	export let word: string;
	export let id: number;
	export let bounds: HTMLDivElement;

	// const dispatch = createEventDispatcher();
	const dispatchDrag = createEventDispatcher<{ drag: { rect: DOMRect } }>();
	const dispatchDragStart = createEventDispatcher<{ dragStart: null }>();
	const dispatchDragEnd = createEventDispatcher<{ dragEnd: { rect: DOMRect } }>();

	let position = 'absolute' as 'static' | 'absolute';
</script>

<div
	style:position
	class="piece"
	use:draggable={{
		onDragEnd: (data) => {
			dispatchDragEnd('dragEnd', { rect: data.domRect });
			position = 'absolute';
		},
		onDragStart: () => {
			dispatchDragStart('dragStart');
		},
		onDrag: (data) => {
			dispatchDrag('drag', { rect: data.domRect });
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
