<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';

	let { isOpen = false, class: className = '', children } = $props();

	const dispatch = createEventDispatcher<{
		toggle: { isOpen: boolean };
	}>();

	function toggle() {
		isOpen = !isOpen;
		dispatch('toggle', { isOpen });
	}
</script>

<div class={className}>
	{@render children?.({ isOpen, toggle })}
</div>

{#if isOpen}
	<div transition:slide={{ duration: 300 }}>
		{@render children?.({ isOpen, toggle })}
	</div>
{/if}
