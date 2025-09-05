<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { Play, Pause, RotateCcw, PlayCircle } from 'lucide-svelte';
	import { 
		selectedAlgorithm, 
		controlState, 
		execution,
		error,
		setGenerating,
		setError,
		showError,
		showSuccess,
		showInfo,
		parameters
	} from '$lib/stores/app';
	import { api } from '$lib/api';
	import { trackAlgorithmExecution, trackUserInteraction } from '$lib/utils/analytics';
	import { debounce, throttle } from '$lib/utils/performance';

	let container: HTMLDivElement;
	let isInitialized = $state(false);
	let currentStep = $state(0);
	let totalSteps = $state(0);
	let isPlaying = $state(false);
	let stepDescription = $state('');
	let comparisons = $state(0);
	let swaps = $state(0);
	let animationTimeout: ReturnType<typeof setTimeout> | null = null;
	let animationSpeed = $state(''); // Default to empty to show "Mul" placeholder - speeds: 1, 2, 4, 8, 16

	// Calculate CSS animation duration based on speed multiplier
	let cssAnimationDuration = $derived(() => {
		const speed = parseFloat(animationSpeed) || 1;
		const baseDuration = 0.5; // Base duration in seconds
		return baseDuration / speed;
	});

	// Update CSS custom properties when animation speed changes
	$effect(() => {
		if (browser && container) {
			container.style.setProperty('--animation-duration', `${cssAnimationDuration}s`);
			container.style.setProperty('--animation-duration-fast', `${cssAnimationDuration * 0.8}s`);
			container.style.setProperty('--animation-duration-slow', `${cssAnimationDuration * 1.2}s`);
		}
	});

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
		} else {
			// Clear visualization when no algorithm is selected
			execution.set(null);
			showBlankGrid();
		}
	});

	onMount(async () => {
		if (!browser) return;
		
		try {
			// Set up custom event listeners
					window.addEventListener('generateData', handleGenerateData);
		window.addEventListener('resetData', handleResetData);

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
		for (let y = 0; y < 5; y++) {
			blankGrid[y] = [];
			for (let x = 0; x < 5; x++) {
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
	}


	async function generateData() {
		if (!$selectedAlgorithm) return;

		const startTime = performance.now();
		try {
			setGenerating(true);
			setError(null);

					// Get parameters from store or use defaults
		const currentParams = $parameters;
		const config = {
			array_size: currentParams.arraySize || 20,
			speed: 5, // API expects 1-10, use default value
			...currentParams // Include all other parameters
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
			
			// Track performance metrics
			const duration = performance.now() - startTime;
			if (browser) {
			trackAlgorithmExecution($selectedAlgorithm.id, duration, steps.length);
			trackUserInteraction('data_generated', 'GridAlgorithmVisualizer');
			}
			
			// Show success notification
			showSuccess(
				'Data Generated',
				`Successfully generated ${steps.length} steps for ${$selectedAlgorithm.name}`,
				3000
			);
			
			// Render first step
			if (steps.length > 0) {
				renderStep(steps[0], 0);
			}
		} catch (error) {
			console.error('Error generating data:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(errorMessage);
			showError(
				'Generation Failed',
				`Failed to generate data: ${errorMessage}`,
				5000
			);
		} finally {
			setGenerating(false);
		}
	}

	function play() {
		if (!$execution || $execution.steps.length === 0) return;
		
		isPlaying = true;
		// Start animation from current slider position
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
		// Clear execution data and show blank grid
		execution.set(null);
		showBlankGrid();
	}


	function handleProgressChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newStep = parseInt(target.value);
		
		
		// Pause animation when user drags slider
		if (isPlaying) {
			pause();
		}
		
		// Update current step and render
		if ($execution && $execution.steps[newStep]) {
			currentStep = newStep;
			renderStep($execution.steps[currentStep], currentStep);
		}
	}

	function goToStep(step: number) {
		if (!$execution || $execution.steps.length === 0) return;
		currentStep = Math.max(0, Math.min(step, $execution.steps.length - 1));
		renderStep($execution.steps[currentStep], currentStep);
	}


	function animate() {
		if (!isPlaying || !$execution || $execution.steps.length === 0) return;
		
		// Check if we've reached the end
		if (currentStep >= $execution.steps.length - 1) {
			isPlaying = false;
			return;
		}

		// Move to next step and render it
		currentStep++;
		renderStep($execution.steps[currentStep], currentStep);

		// Schedule next step with speed multiplier
		const baseSpeed = 500; // Base speed in milliseconds
		const speed = parseFloat(animationSpeed) || 1; // Default to 1x if empty or invalid
		const actualSpeed = baseSpeed / speed;
		animationTimeout = setTimeout(() => {
			animate();
		}, actualSpeed);
	}

	function renderGrid(grid: any[][]) {
		if (!container) return;
		
		container.innerHTML = '';
		
		const gridElement = document.createElement('div');
		gridElement.className = 'grid-container';
		gridElement.style.display = 'grid';
		gridElement.style.gridTemplateColumns = `repeat(5, 1fr)`;
		gridElement.style.gap = '2px';
		gridElement.style.padding = '1rem';
		
		grid.forEach((row, y) => {
			row.forEach((cell, x) => {
				const cellElement = document.createElement('div');
				cellElement.className = 'grid-cell';
				cellElement.style.cssText = `
					width: 30px;
					height: 30px;
					background: var(--bg-tertiary);
					border: 1px solid var(--border-primary);
					border-radius: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--text-primary);
					font-size: 12px;
					font-weight: 600;
					cursor: pointer;
					transition: all var(--transition-normal);
					box-shadow: var(--shadow-xs);
				`;
				cellElement.textContent = cell.value.toString();
				cellElement.onclick = () => handleCellClick(x, y, cell);
				gridElement.appendChild(cellElement);
			});
		});
		
		container.appendChild(gridElement);
	}

	// Debounced render function to prevent excessive re-renders
	const debouncedRenderStep = debounce((step: any, stepIndex: number) => {
		if (!container || !step) return;
		
		// Update step info
		stepDescription = step.metadata?.description || `Step ${stepIndex + 1}`;
		comparisons = step.metadata?.comparisons || 0;
		swaps = step.metadata?.swaps || 0;
		
		// Render the grid with highlights
		if (step.data && Array.isArray(step.data)) {
			renderGridFromArray(step, stepIndex);
		}
	}, 16); // ~60fps

	function renderStep(step: any, stepIndex: number) {
		// Update step information
		stepDescription = step.metadata?.description || step.action || 'Processing...';
		
		// Update statistics
		if (step.action === 'compare') {
			comparisons++;
		} else if (step.action === 'swap' || step.action === 'swap_complete') {
			swaps++;
		}
		
		debouncedRenderStep(step, stepIndex);
	}

	function renderGridFromArray(step: any, stepIndex: number) {
		if (!container) return;
		
		container.innerHTML = '';
		
		// Calculate responsive grid dimensions
		const containerRect = container.getBoundingClientRect();
		const availableWidth = containerRect.width - 32; // Account for padding
		const availableHeight = containerRect.height - 32;
		
		// Calculate grid size based on available space
		const dataLength = step.data.length;
		const gridSize = Math.ceil(Math.sqrt(dataLength));
		const cellSize = Math.min(
			Math.floor(availableWidth / gridSize),
			Math.floor(availableHeight / gridSize),
			80 // Maximum cell size
		);
		
		// Ensure minimum cell size for readability
		const minCellSize = 30;
		const finalCellSize = Math.max(cellSize, minCellSize);
		
		const gridWidth = finalCellSize * gridSize;
		const gridHeight = finalCellSize * gridSize;
		
		const gridElement = document.createElement('div');
		gridElement.className = 'responsive-grid';
		gridElement.style.cssText = `
			display: grid;
			grid-template-columns: repeat(${gridSize}, 1fr);
			gap: 2px;
			width: ${gridWidth}px;
			height: ${gridHeight}px;
			max-width: 100%;
			max-height: 100%;
			margin: 0 auto;
		`;
		
		step.data.forEach((value: number, index: number) => {
			const cellElement = document.createElement('div');
			cellElement.className = 'grid-cell';
			
			const isHighlighted = step.highlights?.includes(index) || false;
			
			cellElement.style.cssText = `
				width: ${finalCellSize}px;
				height: ${finalCellSize}px;
				background: ${isHighlighted ? 'var(--error)' : 'var(--accent-primary)'};
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 14px;
				font-weight: 600;
				cursor: pointer;
				transition: all var(--animation-duration-fast, 0.4s) cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: ${isHighlighted ? '0 0 15px rgba(239, 68, 68, 0.6)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};
				border: ${isHighlighted ? '2px solid #dc2626' : '2px solid transparent'};
				animation: cellAppear var(--animation-duration, 0.5s) cubic-bezier(0.4, 0, 0.2, 1);
				position: relative;
				z-index: 1;
			`;
			cellElement.textContent = value.toString();
			cellElement.onclick = () => handleCellClick(index, 0, { value, type: 'array', x: index, y: 0 });
			gridElement.appendChild(cellElement);
		});
		
		container.appendChild(gridElement);
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
				background: ${isHighlighted ? 'var(--error)' : 'var(--accent-primary)'};
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


	<div class="grid-container" bind:this={container}>
		{#if !isInitialized}
			<div class="loading">Initializing grid visualizer...</div>
				{/if}
		
		<!-- Floating Step Info -->
		<div class="floating-step-info">
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
	</div>

	<!-- Video Player Style Controls -->
	<div class="video-controls">
		<div class="control-group">
			<button 
				onclick={generateData}
				disabled={!$selectedAlgorithm || $controlState.isGenerating}
				class="control-btn generate-btn"
				title={$controlState.isGenerating ? 'Generating...' : 'Generate Data'}
			>
				{#if $controlState.isGenerating}
					<PlayCircle class="w-4 h-4 animate-spin" />
				{:else}
					<PlayCircle class="w-4 h-4" />
				{/if}
			</button>

			<button 
				onclick={isPlaying ? pause : play} 
				disabled={!$execution || $execution.steps.length === 0}
				class="control-btn play-btn" class:paused={!isPlaying}
				title={isPlaying ? 'Pause Animation' : 'Play Animation'}
			>
				{#if isPlaying}
					<Pause class="w-4 h-4" />
				{:else}
					<Play class="w-4 h-4" />
				{/if}
			</button>

			<button 
				onclick={reset} 
				disabled={!$execution || $execution.steps.length === 0}
				class="control-btn reset-btn"
				title="Reset Animation"
			>
				<RotateCcw class="w-4 h-4" />
			</button>
		</div>

		<div class="progress-group">
			<input
				type="range"
				min="0"
				max={Math.max(0, totalSteps - 1)}
				value={currentStep}
				oninput={handleProgressChange}
				onchange={handleProgressChange}
				class="progress-bar"
				disabled={!$execution || $execution.steps.length === 0}
			/>
			<div class="step-display">
				Step {currentStep + 1} of {totalSteps}
		</div>
	</div>

		<div class="speed-group">
			<select 
				bind:value={animationSpeed} 
				class="speed-select"
			>
				<option value="" disabled selected>Mul</option>
				<option value="1">1x</option>
				<option value="2">2x</option>
				<option value="4">4x</option>
				<option value="8">8x</option>
				<option value="16">16x</option>
			</select>
		</div>
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
		background: var(--bg-primary);
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--border-primary);
		transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
	}








	.floating-step-info {
		position: absolute;
		top: 1rem;
		left: 1rem;
		right: 1rem;
		background: var(--bg-primary);
		backdrop-filter: blur(8px);
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-primary);
		box-shadow: var(--shadow-xl);
		z-index: 10;
		pointer-events: none;
		transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.step-description {
		color: var(--text-primary);
		font-size: 0.875rem;
		margin: 0;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.algorithm-stats {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.algorithm-stats span {
		color: var(--text-secondary);
		font-size: 0.75rem;
		background: var(--bg-tertiary);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		transition: color 0.3s ease, background-color 0.3s ease;
	}

	.grid-container {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		padding: 2rem;
		box-sizing: border-box;
		background: var(--bg-primary);
		border-radius: 4px;
		margin: 1rem;
		box-shadow: var(--shadow-sm);
		transition: all var(--transition-slow);
		overflow: hidden;
	}

	.grid-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: radial-gradient(circle, var(--text-tertiary) 1px, transparent 1px);
		background-size: 20px 20px;
		opacity: 0.3;
		transition: opacity var(--transition-slow);
		pointer-events: none;
		z-index: 0;
	}

	.grid-container:hover::before {
		opacity: 0.5;
	}

	.loading {
		color: var(--text-tertiary);
		font-size: 1rem;
		transition: color 0.3s ease;
	}






	.error {
		background: #fed7d7;
		color: #c53030;
		padding: 0.75rem 1rem;
		border-radius: 0.25rem;
		margin: 1rem;
		font-size: 0.875rem;
	}



	/* Video Player Style Controls */
	.video-controls {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--bg-primary);
		border-radius: 0;
		margin-top: 1rem;
		gap: 1rem;
		box-shadow: var(--shadow-md);
		border: 1px solid var(--border-primary);
		transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 16px;
		color: white;
	}

	.generate-btn {
		background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
		color: white;
		width: 40px;
		height: 40px;
		padding: 0;
		border-radius: 50%;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all var(--transition-normal);
		box-shadow: var(--shadow-md);
		letter-spacing: 0.025em;
	}

	.generate-btn:hover:not(:disabled) {
		box-shadow: var(--shadow-lg);
	}

	.generate-btn:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: var(--shadow-sm);
	}

	.generate-btn:disabled {
		background: var(--text-quaternary);
		cursor: not-allowed;
		opacity: 0.6;
		box-shadow: none;
	}

	.play-btn {
		background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
		color: white;
		width: 40px;
		height: 40px;
		padding: 0;
		border-radius: 50%;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all var(--transition-normal);
		box-shadow: var(--shadow-md);
		letter-spacing: 0.025em;
	}

	.play-btn.paused {
		background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
	}

	.play-btn:hover:not(:disabled) {
		box-shadow: var(--shadow-lg);
	}

	.play-btn:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: var(--shadow-sm);
	}

	.play-btn:disabled {
		background: var(--text-quaternary);
		cursor: not-allowed;
		opacity: 0.6;
		box-shadow: none;
	}

	.reset-btn {
		background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
		color: white;
		width: 40px;
		height: 40px;
		padding: 0;
		border-radius: 50%;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all var(--transition-normal);
		box-shadow: var(--shadow-md);
		letter-spacing: 0.025em;
	}

	.reset-btn:hover:not(:disabled) {
		box-shadow: var(--shadow-lg);
	}

	.reset-btn:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: var(--shadow-sm);
	}

	.reset-btn:disabled {
		background: var(--text-quaternary);
		cursor: not-allowed;
		opacity: 0.6;
		box-shadow: none;
	}

	.progress-group {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 200px;
	}

	.progress-bar {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--bg-tertiary);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.progress-bar:hover {
		height: 8px;
	}

	.progress-bar::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--accent-primary);
		cursor: pointer;
		border: 2px solid var(--bg-primary);
		box-shadow: var(--shadow-md);
		transition: all 0.2s;
	}

	.progress-bar::-webkit-slider-thumb:hover {
		transform: scale(1.2);
		background: var(--accent-secondary);
	}

	.progress-bar::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--accent-primary);
		cursor: pointer;
		border: 2px solid var(--bg-primary);
		box-shadow: var(--shadow-md);
	}

	.progress-bar:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.step-display {
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 500;
		min-width: 80px;
		text-align: center;
		transition: color 0.3s ease;
	}

	.speed-group {
		display: flex;
		align-items: center;
	}

	.speed-select {
		padding: 0.5rem;
		background: var(--bg-primary);
		color: var(--text-primary);
		border: 1px solid var(--border-primary);
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 80px;
	}

	.speed-select:hover {
		background: var(--bg-tertiary);
		border-color: var(--border-secondary);
	}

	.speed-select:focus {
		outline: none;
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 2px var(--accent-light);
	}

	/* Responsive Grid */
	@media (max-width: 768px) {
		.grid-container {
			padding: 0.5rem;
			min-height: 300px;
		}

		.floating-step-info {
			top: 0.5rem;
			left: 0.5rem;
			right: 0.5rem;
			padding: 0.5rem 0.75rem;
		}

		.step-description {
			font-size: 0.8rem;
		}

		.algorithm-stats span {
			font-size: 0.7rem;
			padding: 0.125rem 0.375rem;
		}

		.video-controls {
			padding: 0.5rem;
			gap: 0.5rem;
			margin-top: 0.5rem;
		}

		.control-btn {
			width: 36px;
			height: 36px;
			font-size: 14px;
		}

		.generate-btn {
			padding: 0.375rem 0.75rem;
			font-size: 13px;
		}

		.progress-group {
			min-width: 150px;
		}

		.step-display {
			font-size: 0.8rem;
			min-width: 70px;
		}

		.speed-select {
			padding: 0.375rem;
			font-size: 0.8rem;
			min-width: 70px;
		}
	}

	@media (max-width: 480px) {
		.grid-container {
			padding: 0.25rem;
			min-height: 250px;
		}

		.floating-step-info {
			top: 0.25rem;
			left: 0.25rem;
			right: 0.25rem;
			padding: 0.375rem 0.5rem;
		}

		.video-controls {
			flex-direction: column;
			gap: 0.75rem;
			padding: 0.75rem;
		}

		.control-group {
			justify-content: center;
		}

		.progress-group {
			width: 100%;
			min-width: auto;
		}

		.speed-group {
			justify-content: center;
		}
	}

	/* Grid Cell Animations */
	@keyframes cellAppear {
		0% { 
			opacity: 0;
			transform: scale(0.8) translateY(10px);
		}
		50% { 
			opacity: 0.8;
			transform: scale(1.05) translateY(-2px);
		}
		100% { 
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	@keyframes cellJiggle {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-2px); }
		75% { transform: translateX(2px); }
	}

</style>
