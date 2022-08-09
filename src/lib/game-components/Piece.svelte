<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { card } from '$lib/stores';

	// svelte-ignore unused-export-let
	export let id: number;
	export let word: string;
	export let disabled = false;

	// const dispatch = createEventDispatcher();
	const dispatchDrag = createEventDispatcher<{ drag: { rect: DOMRect } }>();
	const dispatchDragStart = createEventDispatcher<{ dragStart: null }>();
	const dispatchDragEnd = createEventDispatcher<{
		dragEnd: { rect: DOMRect };
	}>();

	let position = 'static' as 'static' | 'absolute';
</script>

<div
	style:position
	class="piece"
	use:draggable={{
		disabled,
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
		bounds: $card
	}}
>
	<p>{word}</p>
</div>

<style>
	div {
		user-select: none;
		display: inline-block;
	}
</style>
