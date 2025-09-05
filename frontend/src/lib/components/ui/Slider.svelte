<script lang="ts">
	import type { SliderProps } from '$lib/types';
	import { clsx } from 'clsx';
	import { twMerge } from 'tailwind-merge';

	let {
		min,
		max,
		value,
		step = 1,
		disabled = false,
		onChange,
		class: className = '',
		...rest
	}: SliderProps = $props();

	const baseClasses = 'w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

	const classes = twMerge(baseClasses, className);

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = parseInt(target.value);
		if (onChange) {
			onChange(newValue);
		}
	}
</script>

<input
	type="range"
	{min}
	{max}
	{step}
	{disabled}
	class={classes}
	value={value}
	oninput={handleInput}
	{...rest}
/>

<style>
	input[type="range"]::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	input[type="range"]::-webkit-slider-thumb:hover {
		background: #2563eb;
		transform: scale(1.1);
	}

	input[type="range"]::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	input[type="range"]::-moz-range-thumb:hover {
		background: #2563eb;
		transform: scale(1.1);
	}

	input[type="range"]::-ms-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
	}

	input[type="range"]::-ms-thumb:hover {
		background: #2563eb;
		transform: scale(1.1);
	}
</style>
