<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { card } from '$lib/stores';

	// svelte-ignore unused-export-let
	export let id: number;
	export let word: string;
	export let disabled = false;
	export let x = 0;
	export let y = 0;

	// const dispatch = createEventDispatcher();
	const dispatchDrag = createEventDispatcher<{ drag: { rect: DOMRect } }>();
	const dispatchDragStart = createEventDispatcher<{ dragStart: null }>();
	const dispatchDragEnd = createEventDispatcher<{
		dragEnd: { rect: DOMRect };
	}>();

	let dragged = false;

</script>

<div
	style:opacity={dragged ? 1 : 0.5}
	class="piece"
	use:draggable={{
		disabled,
		defaultPosition: { x, y },
		onDragEnd: (data) => {
			dispatchDragEnd('dragEnd', { rect: data.domRect });
		},
		onDragStart: () => {
			dispatchDragStart('dragStart');
			dragged = true;
		},
		onDrag: (data) => {
			dispatchDrag('drag', { rect: data.domRect });
		},
		bounds: $card
	}}
>
	<p>{word}</p>
</div>

<style>
	div {
		user-select: none;
		position: absolute;
		display: inline-block;
	}
</style>
