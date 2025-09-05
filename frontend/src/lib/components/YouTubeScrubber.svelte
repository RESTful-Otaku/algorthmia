<script lang="ts">
	import { 
		selectedAlgorithm, 
		controlState, 
		execution,
		play,
		pause,
		setCurrentStep,
		setSpeed,
		setGenerating
	} from '$lib/stores/app';

	let isDragging = $state(false);
	let generateLoading = $state(false);
	let resetLoading = $state(false);

	// Speed presets
	const speedPresets = [
		{ label: '0.25x', value: 2000, multiplier: 0.25 },
		{ label: '0.5x', value: 1000, multiplier: 0.5 },
		{ label: '1x', value: 500, multiplier: 1 },
		{ label: '1.5x', value: 333, multiplier: 1.5 },
		{ label: '2x', value: 250, multiplier: 2 }
	];

	let currentSpeedIndex = $state(2); // Default to 1x speed

	// Update speed when preset changes
	$effect(() => {
		if (currentSpeedIndex >= 0 && currentSpeedIndex < speedPresets.length) {
			setSpeed(speedPresets[currentSpeedIndex]?.value || 500);
		}
	});

	async function generateData() {
		if (!$selectedAlgorithm) return;
		
		setGenerating(true);
		
		try {
			// Generate random data for visualization
			const randomArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 1);
			
			// Here you would call the API to generate algorithm steps
			// For now, we'll simulate it
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Update execution with generated data
			execution.set({
				id: crypto.randomUUID(),
				algorithm_id: $selectedAlgorithm.id,
				steps: [], // This would be populated by the API
				current_step: 0,
				is_running: false,
				is_paused: false,
				is_complete: false,
				start_time: new Date().toISOString()
			});
		} catch (err) {
			console.error('Failed to generate data:', err);
		} finally {
			setGenerating(false);
		}
	}

	function reset() {
		resetLoading = true;
		setTimeout(() => {
			execution.set(null);
			setCurrentStep(0);
			pause();
			resetLoading = false;
		}, 300);
	}

	function playPause() {
		if ($controlState.isPlaying) {
			pause();
		} else {
			play();
		}
	}

	function seekToStep(event: Event) {
		const target = event.target as HTMLInputElement;
		const step = parseInt(target.value);
		setCurrentStep(step);
		pause();
	}

	// Mouse event handlers for scrubber
	function handleMouseMove(event: MouseEvent) {
		if (!isDragging || !$execution) return;
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const step = Math.round(percentage * ($execution.steps.length - 1));
		setCurrentStep(step);
		pause();
	}

	function handleMouseDown(event: MouseEvent) {
		if (!$execution) return;
		isDragging = true;
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, x / rect.width));
		const step = Math.round(percentage * ($execution.steps.length - 1));
		setCurrentStep(step);
		pause();
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Calculate progress percentage
	let progressPercentage = $derived(
		$execution && $execution.steps.length > 0 
			? ($controlState.currentStep / ($execution.steps.length - 1)) * 100 
			: 0
	);

	let hasSteps = $derived($execution && $execution.steps.length > 0);
</script>

<div class="video-player-controls text-white px-4 py-3 flex items-center space-x-4">
	<!-- Generate Data Button -->
	<button
		onclick={generateData}
		disabled={generateLoading || !$selectedAlgorithm}
		class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap {(generateLoading || !$selectedAlgorithm) ? 'opacity-50 cursor-not-allowed' : ''}"
	>
		{#if generateLoading}
			<div class="spinner w-4 h-4 mr-2"></div>
		{:else}
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"></path>
			</svg>
		{/if}
		Generate
	</button>

	<!-- Play/Pause Button -->
	<button
		onclick={playPause}
		disabled={!$selectedAlgorithm || !hasSteps}
		class="bg-white text-slate-900 hover:bg-slate-100 disabled:bg-slate-400 p-2 rounded-lg transition-colors {(!$selectedAlgorithm || !hasSteps) ? 'opacity-50 cursor-not-allowed' : ''}"
		title={!$selectedAlgorithm ? 'Select an algorithm first' : !hasSteps ? 'Generate data first' : $controlState.isPlaying ? 'Pause' : 'Play'}
	>
		{#if $controlState.isPlaying}
			<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
			</svg>
		{:else}
			<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M8 5v14l11-7z"/>
			</svg>
		{/if}
	</button>

	<!-- Timeline Scrubber (takes up remaining space) -->
	<div class="flex-1 relative mx-4">
		<!-- Progress Info -->
		<div class="flex items-center justify-between text-xs text-slate-400 mb-1">
			<span>
				{!$selectedAlgorithm ? 'No algorithm selected' : hasSteps ? `Step ${$controlState.currentStep + 1} of ${$execution?.steps.length || 0}` : 'No data generated'}
			</span>
			<span>
				{!$selectedAlgorithm ? 'Select an algorithm to begin' : hasSteps ? `${Math.round(progressPercentage)}% Complete` : 'Click Generate Data to start'}
			</span>
		</div>
		
		<!-- Scrubber Container -->
		<div 
			class="relative h-2 bg-slate-700 rounded-full {(!$selectedAlgorithm || !hasSteps) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'}"
			role="slider"
			aria-label="Timeline scrubber"
			aria-valuemin="0"
			aria-valuemax={$execution ? Math.max(0, ($execution.steps?.length || 0) - 1) : 0}
			aria-valuenow={$controlState.currentStep}
			tabindex="0"
			onmousemove={(!$selectedAlgorithm || !hasSteps) ? undefined : handleMouseMove}
			onmousedown={(!$selectedAlgorithm || !hasSteps) ? undefined : handleMouseDown}
			onmouseup={(!$selectedAlgorithm || !hasSteps) ? undefined : handleMouseUp}
		>
			<!-- Progress Bar -->
			<div 
				class="absolute top-0 left-0 h-2 bg-red-600 rounded-full transition-all duration-150"
				style="width: {progressPercentage}%"
			></div>
			<!-- Scrubber Thumb -->
			<div 
				class="absolute top-1/2 w-4 h-4 bg-red-600 rounded-full transform -translate-y-1/2 transition-all duration-150 group-hover:scale-110"
				style="left: {progressPercentage}%"
			></div>
		</div>
		
		<!-- Hidden Range Input for Accessibility -->
		<input
			type="range"
			min="0"
			max={$execution ? Math.max(0, ($execution.steps?.length || 0) - 1) : 0}
			value={$controlState.currentStep}
			oninput={(!$selectedAlgorithm || !hasSteps) ? undefined : seekToStep}
			disabled={!$selectedAlgorithm || !hasSteps}
			class="absolute inset-0 w-full h-full opacity-0 {(!$selectedAlgorithm || !hasSteps) ? 'cursor-not-allowed' : 'cursor-pointer'}"
		/>
	</div>

	<!-- Speed Dropdown (only show when algorithm is selected) -->
	{#if $selectedAlgorithm}
		<div class="flex items-center space-x-2">
			<label for="speed-select" class="text-sm text-slate-300 whitespace-nowrap">Speed:</label>
			<select
				id="speed-select"
				bind:value={currentSpeedIndex}
				class="bg-slate-700 text-white text-sm px-2 py-1 rounded border border-slate-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
			>
				{#each speedPresets as preset, index}
					<option value={index}>{preset.label}</option>
				{/each}
			</select>
		</div>
	{/if}

	<!-- Reset Button -->
	<button
		onclick={reset}
		disabled={resetLoading || !$selectedAlgorithm}
		class="bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap {(resetLoading || !$selectedAlgorithm) ? 'opacity-50 cursor-not-allowed' : ''}"
	>
		{#if resetLoading}
			<div class="spinner w-4 h-4 mr-2"></div>
		{:else}
			<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"></path>
			</svg>
		{/if}
		Reset
	</button>
</div>

<style>
	.video-player-controls {
		user-select: none;
	}

	.video-player-controls button:focus {
		outline: 2px solid #ef4444;
		outline-offset: 2px;
	}

	.video-player-controls select:focus {
		outline: 2px solid #ef4444;
		outline-offset: 2px;
	}

	.spinner {
		border: 2px solid transparent;
		border-top: 2px solid currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
