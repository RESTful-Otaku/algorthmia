<script lang="ts">
	import type { CardProps } from '$lib/types';
	import { clsx } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	let {
		title,
		subtitle,
		actions,
		hover = false,
		onClick,
		class: className = '',
		children,
		...rest
	}: CardProps & { children?: any } = $props();

	const baseClasses = 'bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-sm p-4 transition-all duration-200';
	const hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-0.5' : '';
	const clickableClasses = onClick ? 'cursor-pointer' : '';

	const classes = twMerge(baseClasses, hoverClasses, clickableClasses, className);

	function handleClick() {
		if (onClick) {
			onClick();
		}
	}
</script>

<div
	class={classes}
	onclick={handleClick}
	{...rest}
>
	{#if title || subtitle}
		<div class="mb-3">
			{#if title}
				<h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
					{title}
				</h3>
			{/if}
			{#if subtitle}
				<p class="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
					{subtitle}
				</p>
			{/if}
		</div>
	{/if}

	<div class="space-y-3">
		{@render children?.()}
	</div>

	{#if actions && actions.length > 0}
		<div class="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-secondary-200 dark:border-secondary-700">
			{#each actions as action}
				{@render action()}
			{/each}
		</div>
	{/if}
</div>
