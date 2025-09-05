<script lang="ts">
	import type { ButtonProps } from '$lib/types';
	import { clsx } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		onClick,
		class: className = '',
		children,
		...rest
	}: ButtonProps & { children?: any } = $props();

	const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed btn-hover';

	const variants = {
		primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
		secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-100',
		outline: 'border border-secondary-300 hover:bg-secondary-50 text-secondary-700 dark:border-secondary-600 dark:hover:bg-secondary-800 dark:text-secondary-300',
		ghost: 'hover:bg-secondary-100 text-secondary-700 dark:hover:bg-secondary-800 dark:text-secondary-300',
		danger: 'bg-error-600 hover:bg-error-700 text-white shadow-sm hover:shadow-md',
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
	};

	const classes = twMerge(
		baseClasses,
		variants[variant],
		sizes[size],
		className
	);

	function handleClick() {
		if (!disabled && !loading && onClick) {
			onClick();
		}
	}
</script>

<button
	class={classes}
	{disabled}
	onclick={handleClick}
	{...rest}
>
	{#if loading}
		<svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	{/if}
	{@render children?.()}
</button>
