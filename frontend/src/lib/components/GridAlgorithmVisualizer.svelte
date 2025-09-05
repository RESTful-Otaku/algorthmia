<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { 
		selectedAlgorithm, 
		controlState, 
		execution,
		error,
		setGenerating,
		setError
	} from '$lib/stores/app';
	import { api } from '$lib/api';

	let container: HTMLDivElement;
	let isInitialized = $state(false);
	let currentStep = $state(0);
	let totalSteps = $state(0);
	let isPlaying = $state(false);
	let stepDescription = $state('');
	let comparisons = $state(0);
	let swaps = $state(0);
	let animationTimeout: ReturnType<typeof setTimeout> | null = null;

	// Grid parameters
	let gridWidth = $state(10);
	let gridHeight = $state(10);

	// Subscribe to algorithm changes
	$effect(() => {
		if ($selectedAlgorithm) {
			// Reset when algorithm changes
			currentStep = 0;
			totalSteps = 0;
			isPlaying = false;
			stepDescription = '';
			comparisons = 0;
			swaps = 0;
		}
	});

	onMount(async () => {
		if (!browser) return;
		
		try {
			// Set up custom event listeners
			window.addEventListener('generateData', handleGenerateData);
			window.addEventListener('resetData', handleResetData);
			window.addEventListener('setSpeed', handleSetSpeed as EventListener);

			// Show initial blank grid
			showBlankGrid();

			isInitialized = true;
			console.log('GridAlgorithmVisualizer initialized');
		} catch (error) {
			console.error('Failed to initialize GridAlgorithmVisualizer:', error);
		}
	});

	onDestroy(() => {
		if (!browser) return;
		
		// Clean up event listeners
		window.removeEventListener('generateData', handleGenerateData);
		window.removeEventListener('resetData', handleResetData);
		window.removeEventListener('setSpeed', handleSetSpeed as EventListener);
		
		// Clear any pending timeouts
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
	});

	function handleCellClick(x: number, y: number, cell: any) {
		console.log(`Cell clicked: (${x}, ${y})`, cell);
		// Handle cell interaction based on selected algorithm
		// This could be used to manually place walls, start/end points, etc.
	}

	function showBlankGrid() {
		if (!container) return;
		
		// Create a blank grid with dots
		const blankGrid: any[][] = [];
		for (let y = 0; y < gridHeight; y++) {
			blankGrid[y] = [];
			for (let x = 0; x < gridWidth; x++) {
				blankGrid[y][x] = {
					x,
					y,
					type: 'empty',
					value: Math.floor(Math.random() * 100) + 1 // Random values for visual appeal
				};
			}
		}
		
		renderGrid(blankGrid);
	}

	function handleGenerateData() {
		generateData();
	}

	function handleResetData() {
		reset();
		showBlankGrid();
	}

	function handleSetSpeed(event: CustomEvent) {
		setAnimationSpeed(event.detail);
	}

	async function generateData() {
		if (!$selectedAlgorithm) return;

		try {
			setGenerating(true);
			setError(null);

			const config = {
				array_size: 20,
				speed: $controlState.speed,
				data: []
			};

			const steps = await api.executeAlgorithm($selectedAlgorithm.id, config);
			
			// Update execution with generated steps
			execution.set({
				id: crypto.randomUUID(),
				algorithm_id: $selectedAlgorithm.id,
				steps: steps,
				current_step: 0,
				is_running: false,
				is_paused: false,
				is_complete: false,
				start_time: new Date().toISOString()
			});

			totalSteps = steps.length;
			currentStep = 0;
			
			// Render first step
			if (steps.length > 0) {
				renderStep(steps[0], 0);
			}
		} catch (error) {
			console.error('Error generating data:', error);
			setError(error instanceof Error ? error.message : 'Unknown error');
		} finally {
			setGenerating(false);
		}
	}

	function play() {
		if (!$execution || $execution.steps.length === 0) return;
		isPlaying = true;
		animate();
	}

	function pause() {
		isPlaying = false;
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
	}

	function reset() {
		currentStep = 0;
		isPlaying = false;
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
		if ($execution && $execution.steps.length > 0) {
			renderStep($execution.steps[0], 0);
		}
	}

	function stepForward() {
		if (!$execution || $execution.steps.length === 0) return;
		if (currentStep < $execution.steps.length - 1) {
			currentStep++;
			renderStep($execution.steps[currentStep], currentStep);
		}
	}

	function stepBackward() {
		if (!$execution || $execution.steps.length === 0) return;
		if (currentStep > 0) {
			currentStep--;
			renderStep($execution.steps[currentStep], currentStep);
		}
	}

	function goToStep(step: number) {
		if (!$execution || $execution.steps.length === 0) return;
		currentStep = Math.max(0, Math.min(step, $execution.steps.length - 1));
		renderStep($execution.steps[currentStep], currentStep);
	}

	function setAnimationSpeed(speed: number) {
		// Speed is handled by the store
	}

	function animate() {
		if (!isPlaying || !$execution || $execution.steps.length === 0) return;
		
		if (currentStep >= $execution.steps.length - 1) {
			isPlaying = false;
			return;
		}

		currentStep++;
		renderStep($execution.steps[currentStep], currentStep);

		animationTimeout = setTimeout(() => {
			animate();
		}, $controlState.speed);
	}

	function renderGrid(grid: any[][]) {
		if (!container) return;
		
		container.innerHTML = '';
		
		const gridElement = document.createElement('div');
		gridElement.className = 'grid-container';
		gridElement.style.display = 'grid';
		gridElement.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
		gridElement.style.gap = '2px';
		gridElement.style.padding = '1rem';
		
		grid.forEach((row, y) => {
			row.forEach((cell, x) => {
				const cellElement = document.createElement('div');
				cellElement.className = 'grid-cell';
				cellElement.style.cssText = `
					width: 30px;
					height: 30px;
					background: #374151;
					border-radius: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					font-size: 12px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.2s;
				`;
				cellElement.textContent = cell.value.toString();
				cellElement.onclick = () => handleCellClick(x, y, cell);
				gridElement.appendChild(cellElement);
			});
		});
		
		container.appendChild(gridElement);
	}

	function renderStep(step: any, stepIndex: number) {
		if (!container || !step) return;
		
		// Update step info
		stepDescription = step.metadata?.description || `Step ${stepIndex + 1}`;
		comparisons = step.metadata?.comparisons || 0;
		swaps = step.metadata?.swaps || 0;
		
		// Render the grid with highlights
		if (step.data && Array.isArray(step.data)) {
			renderArrayStep(step, stepIndex);
		}
	}

	function renderArrayStep(step: any, stepIndex: number) {
		if (!container) return;
		
		container.innerHTML = '';
		
		const arrayElement = document.createElement('div');
		arrayElement.className = 'array-container';
		arrayElement.style.cssText = `
			display: flex;
			gap: 4px;
			padding: 1rem;
			justify-content: center;
			align-items: end;
			height: 200px;
		`;
		
		step.data.forEach((value: number, index: number) => {
			const barElement = document.createElement('div');
			barElement.className = 'array-bar';
			
			const isHighlighted = step.highlights?.includes(index) || false;
			const height = (value / 100) * 150; // Scale to fit container
			
			barElement.style.cssText = `
				width: 20px;
				height: ${height}px;
				background: ${isHighlighted ? '#ef4444' : '#3b82f6'};
				border-radius: 2px;
				display: flex;
				align-items: end;
				justify-content: center;
				color: white;
				font-size: 10px;
				font-weight: 600;
				transition: all 0.3s;
				box-shadow: ${isHighlighted ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'};
			`;
			barElement.textContent = value.toString();
			arrayElement.appendChild(barElement);
		});
		
		container.appendChild(arrayElement);
	}

	// Update grid size when parameters change
	$effect(() => {
		if (isInitialized) {
			showBlankGrid();
		}
	});
</script>

<div class="grid-visualizer-container">
	<div class="grid-controls">
		<div class="grid-parameters">
			<label for="grid-width">Width:</label>
			<input 
				id="grid-width" 
				type="number" 
				bind:value={gridWidth} 
				min="5" 
				max="50" 
				disabled={isPlaying}
			/>
			
			<label for="grid-height">Height:</label>
			<input 
				id="grid-height" 
				type="number" 
				bind:value={gridHeight} 
				min="5" 
				max="50" 
				disabled={isPlaying}
			/>
		</div>

		<div class="algorithm-controls">
			<button 
				onclick={generateData} 
				disabled={!$selectedAlgorithm || $controlState.isGenerating}
				class="btn btn-primary"
			>
				{#if $controlState.isGenerating}
					Generating...
				{:else}
					Generate Data
				{/if}
			</button>

			<button 
				onclick={isPlaying ? pause : play} 
				disabled={!$execution || $execution.steps.length === 0}
				class="btn btn-secondary"
			>
				{isPlaying ? 'Pause' : 'Play'}
			</button>

			<button 
				onclick={reset} 
				disabled={!$execution || $execution.steps.length === 0}
				class="btn btn-secondary"
			>
				Reset
			</button>
		</div>

		<div class="step-controls">
			<button 
				onclick={stepBackward} 
				disabled={currentStep <= 0}
				class="btn btn-small"
			>
				←
			</button>

			<span class="step-info">
				{currentStep} / {totalSteps}
			</span>

			<button 
				onclick={stepForward} 
				disabled={currentStep >= totalSteps - 1}
				class="btn btn-small"
			>
				→
			</button>
		</div>
	</div>

	<div class="grid-info">
		{#if stepDescription}
			<p class="step-description">{stepDescription}</p>
		{/if}
		
		{#if comparisons > 0 || swaps > 0}
			<div class="algorithm-stats">
				{#if comparisons > 0}
					<span>Comparisons: {comparisons}</span>
				{/if}
				{#if swaps > 0}
					<span>Swaps: {swaps}</span>
				{/if}
			</div>
		{/if}
	</div>

	<div class="grid-container" bind:this={container}>
		{#if !isInitialized}
			<div class="loading">Initializing grid visualizer...</div>
		{/if}
	</div>

	{#if $error}
		<div class="error">
			Error: {$error}
		</div>
	{/if}
</div>

<style>
	.grid-visualizer-container {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: #1a202c;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.grid-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #2d3748;
		border-bottom: 1px solid #4a5568;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.grid-parameters {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.grid-parameters label {
		color: #e2e8f0;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.grid-parameters input {
		width: 60px;
		padding: 0.25rem 0.5rem;
		border: 1px solid #4a5568;
		border-radius: 0.25rem;
		background: #1a202c;
		color: #e2e8f0;
		font-size: 0.875rem;
	}

	.algorithm-controls {
		display: flex;
		gap: 0.5rem;
	}

	.step-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.step-info {
		color: #e2e8f0;
		font-size: 0.875rem;
		font-weight: 500;
		min-width: 60px;
		text-align: center;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #4299e1;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #3182ce;
	}

	.btn-secondary {
		background: #4a5568;
		color: #e2e8f0;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #2d3748;
	}

	.btn-small {
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
	}

	.grid-info {
		padding: 0.5rem 1rem;
		background: #2d3748;
		border-bottom: 1px solid #4a5568;
	}

	.step-description {
		color: #e2e8f0;
		font-size: 0.875rem;
		margin: 0;
	}

	.algorithm-stats {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.algorithm-stats span {
		color: #a0aec0;
		font-size: 0.75rem;
	}

	.grid-container {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
	}

	.loading {
		color: #a0aec0;
		font-size: 1rem;
	}

	.error {
		background: #fed7d7;
		color: #c53030;
		padding: 0.75rem 1rem;
		border-radius: 0.25rem;
		margin: 1rem;
		font-size: 0.875rem;
	}

	:global(.dark) .grid-visualizer-container {
		background: #1a202c;
	}

	:global(.dark) .grid-controls {
		background: #2d3748;
	}

	:global(.dark) .grid-info {
		background: #2d3748;
	}
</style>
