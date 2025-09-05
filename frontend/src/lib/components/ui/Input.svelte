<script lang="ts">
	import type { InputProps } from '$lib/types';
	import { clsx } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	let {
		type = 'text',
		placeholder = '',
		value = '',
		disabled = false,
		required = false,
		min,
		max,
		step,
		onChange,
		class: className = '',
		...rest
	}: InputProps = $props();

	const baseClasses = 'block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-500 dark:placeholder-secondary-400 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

	const classes = twMerge(baseClasses, className);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = type === 'number' ? Number(target.value) : target.value;
		if (onChange) {
			onChange(newValue);
		}
	}
</script>

<input
	{type}
	{placeholder}
	{disabled}
	{required}
	{min}
	{max}
	{step}
	class={classes}
	value={value}
	oninput={handleInput}
	{...rest}
/>
