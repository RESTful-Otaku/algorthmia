<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/app';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	
	// Apply theme class to document
	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', $theme === 'dark');
		}
	});
	
	onMount(() => {
		// Initialize theme from localStorage or system preference
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		theme.set(savedTheme || systemTheme);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Algorithm Visualizer</title>
	<meta name="description" content="Interactive algorithm visualization tool" />
</svelte:head>

<div class="min-h-screen bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 transition-colors duration-300">
	{@render children?.()}
</div>
