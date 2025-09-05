<script lang="ts">
	import { 
		selectedAlgorithm, 
		sidePanelState, 
		theme,
		toggleSidePanel, 
		toggleTheme 
	} from '$lib/stores/app';
	import { Menu, Sun, Moon, Info } from 'lucide-svelte';
	import Button from './ui/Button.svelte';
	import Collapsible from './ui/Collapsible.svelte';

	let showDescription = false;
</script>

<header class="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4">
	<div class="flex items-center justify-between">
		<!-- Left side -->
		<div class="flex items-center space-x-4">
			<Button
				variant="ghost"
				size="sm"
				onClick={toggleSidePanel}
				class="lg:hidden"
			>
				<Menu class="w-5 h-5" />
			</Button>
			
			<div class="flex items-center space-x-3">
				<h1 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
					Algorithm Visualizer
				</h1>
				<span class="text-sm text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
					v1.0.0
				</span>
			</div>
		</div>

		<!-- Center - Algorithm info -->
		{#if $selectedAlgorithm}
			<div class="flex-1 max-w-md mx-6">
				<div class="flex items-center space-x-2">
					<h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
						{$selectedAlgorithm.name}
					</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => showDescription = !showDescription}
					>
						<Info class="w-4 h-4" />
					</Button>
				</div>
				
				<div class="flex items-center space-x-4 text-sm text-secondary-600 dark:text-secondary-400">
					<span>
						<strong>Time:</strong> {$selectedAlgorithm.time_complexity}
					</span>
					<span>
						<strong>Space:</strong> {$selectedAlgorithm.space_complexity}
					</span>
				</div>
			</div>
		{/if}

		<!-- Right side -->
		<div class="flex items-center space-x-2">
			<Button
				variant="ghost"
				size="sm"
				onClick={toggleTheme}
				class="p-2"
			>
				{#if $theme === 'light'}
					<Moon class="w-5 h-5" />
				{:else}
					<Sun class="w-5 h-5" />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Algorithm Description (Collapsible) -->
	{#if $selectedAlgorithm && showDescription}
		<Collapsible isOpen={showDescription}>
			{#snippet children({ isOpen, toggle }: { isOpen: boolean; toggle: () => void })}
				{#if isOpen}
					<div class="mt-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
						<p class="text-sm text-secondary-700 dark:text-secondary-300 leading-relaxed">
							{$selectedAlgorithm.description}
						</p>
					</div>
				{/if}
			{/snippet}
		</Collapsible>
	{/if}
</header>
