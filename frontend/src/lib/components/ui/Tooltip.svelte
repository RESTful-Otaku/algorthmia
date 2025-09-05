<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		text: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		delay?: number;
		disabled?: boolean;
		children?: any;
	}

	let { 
		text,
		position = 'top',
		delay = 500,
		disabled = false,
		children
	}: Props = $props();

	let showTooltip = $state(false);
	let tooltipElement: HTMLDivElement;
	let triggerElement: HTMLElement;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});

	function handleMouseEnter() {
		if (disabled || !text) return;
		
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		
		timeoutId = setTimeout(() => {
			showTooltip = true;
		}, delay);
	}

	function handleMouseLeave() {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		showTooltip = false;
	}

	function handleFocus() {
		if (disabled || !text) return;
		showTooltip = true;
	}

	function handleBlur() {
		showTooltip = false;
	}

	function updatePosition() {
		if (!browser || !tooltipElement || !triggerElement) return;

		const triggerRect = triggerElement.getBoundingClientRect();
		const tooltipRect = tooltipElement.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};

		let top = 0;
		let left = 0;

		switch (position) {
			case 'top':
				top = triggerRect.top - tooltipRect.height - 8;
				left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
				break;
			case 'bottom':
				top = triggerRect.bottom + 8;
				left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
				break;
			case 'left':
				top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
				left = triggerRect.left - tooltipRect.width - 8;
				break;
			case 'right':
				top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
				left = triggerRect.right + 8;
				break;
		}

		// Keep tooltip within viewport
		if (left < 8) left = 8;
		if (left + tooltipRect.width > viewport.width - 8) {
			left = viewport.width - tooltipRect.width - 8;
		}
		if (top < 8) top = 8;
		if (top + tooltipRect.height > viewport.height - 8) {
			top = viewport.height - tooltipRect.height - 8;
		}

		tooltipElement.style.top = `${top}px`;
		tooltipElement.style.left = `${left}px`;
	}

	$effect(() => {
		if (showTooltip && tooltipElement) {
			updatePosition();
		}
	});
</script>

<div 
	bind:this={triggerElement}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onfocus={handleFocus}
	onblur={handleBlur}
	style="display: contents;"
>
	{@render children?.()}
</div>

{#if showTooltip && text && !disabled}
	<div
		bind:this={tooltipElement}
		class="tooltip"
		role="tooltip"
		aria-live="polite"
	>
		{text}
	</div>
{/if}

<style>
	.tooltip {
		position: fixed;
		z-index: 10000;
		background: var(--bg-tooltip, #1f2937);
		color: var(--text-tooltip, #ffffff);
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		pointer-events: none;
		white-space: nowrap;
		max-width: 200px;
		word-wrap: break-word;
		white-space: normal;
		animation: tooltipFadeIn 0.2s ease-out;
	}

	.tooltip::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border: 4px solid transparent;
	}

	.tooltip[data-position="top"]::before {
		bottom: -8px;
		left: 50%;
		transform: translateX(-50%);
		border-top-color: var(--bg-tooltip, #1f2937);
	}

	.tooltip[data-position="bottom"]::before {
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		border-bottom-color: var(--bg-tooltip, #1f2937);
	}

	.tooltip[data-position="left"]::before {
		right: -8px;
		top: 50%;
		transform: translateY(-50%);
		border-left-color: var(--bg-tooltip, #1f2937);
	}

	.tooltip[data-position="right"]::before {
		left: -8px;
		top: 50%;
		transform: translateY(-50%);
		border-right-color: var(--bg-tooltip, #1f2937);
	}

	@keyframes tooltipFadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Dark mode support */
	:global(.dark) .tooltip {
		--bg-tooltip: #374151;
		--text-tooltip: #f9fafb;
	}
</style>
