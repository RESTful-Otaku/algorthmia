<script lang="ts">
	import { 
		selectedAlgorithm, 
		execution, 
		controlState, 
		currentStep,
		isLoading 
	} from '$lib/stores/app';
	import type { AlgorithmStep } from '$lib/types';

	let containerRef: HTMLDivElement;
	let isGenerating = false;

	// Reactive data for visualization
	$: currentData = $currentStep?.data || [];
	$: highlights = $currentStep?.highlights || [];
	$: stepInfo = $currentStep?.metadata || {};

	// Generate random data when algorithm changes
	$: if ($selectedAlgorithm && !$execution) {
		generateData();
	}

	function generateData() {
		if (!$selectedAlgorithm) return;
		
		const size = 20; // Default size
		const data = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
		
		// Update the visualization with new data
		// This would typically trigger algorithm execution
	}

	function getCellClass(index: number): string {
		const baseClass = 'grid-cell';
		const highlightClass = highlights.includes(index) ? 'highlighted' : '';
		const actionClass = getActionClass($currentStep?.action, index);
		return `${baseClass} ${highlightClass} ${actionClass}`.trim();
	}

	function getActionClass(action: string | undefined, index: number): string {
		if (!action || !highlights.includes(index)) return '';
		
		switch (action) {
			case 'compare':
				return 'comparing';
			case 'swap':
			case 'swap_complete':
				return 'swapping';
			case 'complete':
				return 'sorted';
			default:
				return '';
		}
	}

	function getCellValue(index: number): number {
		return currentData[index] || 0;
	}

	function getCellHeight(value: number): string {
		const maxValue = Math.max(...currentData, 1);
		const percentage = (value / maxValue) * 100;
		return `${Math.max(percentage, 10)}%`;
	}
</script>

<div class="h-full bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden">
	<!-- Header -->
	<div class="p-4 border-b border-secondary-200 dark:border-secondary-700">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
				Visualization
			</h3>
			{#if $selectedAlgorithm}
				<div class="text-sm text-secondary-600 dark:text-secondary-400">
					Step {$controlState.currentStep + 1} of {$controlState.totalSteps}
				</div>
			{/if}
		</div>
	</div>

	<!-- Visualization Area -->
	<div class="flex-1 p-6 h-full">
		{#if $isLoading}
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p class="text-secondary-600 dark:text-secondary-400">Loading...</p>
				</div>
			</div>
		{:else if !$selectedAlgorithm}
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<div class="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
						</svg>
					</div>
					<h4 class="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
						No Algorithm Selected
					</h4>
					<p class="text-secondary-600 dark:text-secondary-400">
						Select an algorithm from the side panel to start visualizing
					</p>
				</div>
			</div>
		{:else if currentData.length === 0}
			<div class="flex items-center justify-center h-full">
				<div class="text-center">
					<div class="animate-pulse w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
					</div>
					<h4 class="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
						Ready to Visualize
					</h4>
					<p class="text-secondary-600 dark:text-secondary-400">
						Click "Generate" to create data and start the algorithm
					</p>
				</div>
			</div>
		{:else}
			<!-- Algorithm Visualization Grid -->
			<div 
				bind:this={containerRef}
				class="h-full flex items-end justify-center space-x-1 p-4"
			>
				{#each currentData as value, index (index)}
					<div class="flex flex-col items-center space-y-2">
						<!-- Value Bar -->
						<div 
							class={getCellClass(index)}
							style="height: {getCellHeight(value)}; min-height: 20px; width: 40px;"
							role="button"
							tabindex="0"
						>
							<span class="text-xs font-medium text-secondary-700 dark:text-secondary-300">
								{value}
							</span>
						</div>
						
						<!-- Index Label -->
						<span class="text-xs text-secondary-500 dark:text-secondary-400 font-mono">
							{index}
						</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Step Information -->
	{#if $currentStep && $currentStep.metadata.description}
		<div class="p-4 bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
			<div class="text-sm text-secondary-700 dark:text-secondary-300">
				<strong>Step {$currentStep.step_number + 1}:</strong> {$currentStep.metadata.description}
			</div>
		</div>
	{/if}
</div>
