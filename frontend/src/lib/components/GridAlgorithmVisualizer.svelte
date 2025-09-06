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
		parameters,
		isModalOpen
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
	let animationFrameId: number | null = null;
	let animationSpeed = $state(''); // Default to empty to show "Mul" placeholder - speeds: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512

	// Color palette for multiple highlighted cells - optimized for both light and dark modes
	const highlightColors = [
		'#22c55e', // Green - high contrast in both modes
		'#dc2626', // Red - darker red for better contrast
		'#2563eb', // Blue - darker blue for better contrast
		'#d97706', // Orange - darker orange for better contrast
		'#7c3aed', // Purple - darker purple for better contrast
		'#0891b2', // Cyan - darker cyan for better contrast
		'#65a30d', // Lime - darker lime for better contrast
		'#ea580c', // Orange-600 - darker orange for better contrast
		'#db2777', // Pink - darker pink for better contrast
		'#4f46e5', // Indigo - darker indigo for better contrast
	];

	// Function to get highlight color for a cell based on its position in highlights array
	function getHighlightColor(highlightIndex: number): string {
		return highlightColors[highlightIndex % highlightColors.length];
	}

	// Calculate CSS animation duration based on speed multiplier
	let cssAnimationDuration = $derived((): number => {
		const speed = parseFloat(animationSpeed) || 1;
		const baseDuration = 0.5; // Base duration in seconds
		// For ultra-high speeds, cap the minimum duration to ensure animations are visible
		const minDuration = speed >= 32 ? 0.05 : 0.01; // 50ms for ultra-fast, 10ms for others
		return Math.max(baseDuration / speed, minDuration);
	});

	// Update CSS custom properties when animation speed changes
	$effect(() => {
		if (browser && container) {
			const duration = Number(cssAnimationDuration);
			container.style.setProperty('--animation-duration', `${duration}s`);
			container.style.setProperty('--animation-duration-fast', `${duration * 0.8}s`);
			container.style.setProperty('--animation-duration-slow', `${duration * 1.2}s`);
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
		
		// Clear any pending timeouts and animation frames
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
	});

	function handleCellClick(x: number, y: number, cell: any) {
		console.log(`Cell clicked: (${x}, ${y})`, cell);
		// Handle cell interaction based on selected algorithm
		// This could be used to manually place walls, start/end points, etc.
	}

	function showBlankGrid() {
		if (!container) return;
		
		// Get grid dimensions from parameters
		const currentParams = $parameters;
		const gridWidth = currentParams.gridWidth || 10;
		const gridHeight = currentParams.gridHeight || 10;
		const totalCells = gridWidth * gridHeight;
		
		// Generate sorted values from lowest to highest
		const sortedValues = Array.from({ length: totalCells }, (_, i) => i + 1);
		
		// Create a grid with sorted values
		const blankGrid: any[][] = [];
		for (let y = 0; y < gridHeight; y++) {
			blankGrid[y] = [];
			for (let x = 0; x < gridWidth; x++) {
				const index = y * gridWidth + x;
				blankGrid[y][x] = {
					x,
					y,
					type: 'empty',
					value: sortedValues[index]
				};
			}
		}
		
		renderGrid(blankGrid);
	}

	function renderRandomizedGrid(randomizedValues: number[], gridWidth: number, gridHeight: number) {
		if (!container) return;
		
		container.innerHTML = '';
		
		// Calculate responsive cell size
		const containerRect = container.getBoundingClientRect();
		const availableWidth = containerRect.width - 32;
		const availableHeight = containerRect.height - 32;
		
		const cellSize = Math.min(
			Math.floor(availableWidth / gridWidth),
			Math.floor(availableHeight / gridHeight),
			60
		);
		
		const finalCellSize = Math.max(cellSize, 25);
		
		const gridElement = document.createElement('div');
		gridElement.className = 'responsive-grid';
		gridElement.style.cssText = `
			display: grid;
			grid-template-columns: repeat(${gridWidth}, 1fr);
			grid-template-rows: repeat(${gridHeight}, 1fr);
			gap: 2px;
			width: fit-content;
			height: fit-content;
			max-width: 100%;
			max-height: 100%;
			margin: 0 auto;
			justify-content: center;
			align-items: center;
		`;
		
		// Create grid with randomized values
		for (let i = 0; i < randomizedValues.length; i++) {
			const cellElement = document.createElement('div');
			cellElement.className = 'grid-cell';
			
			// Convert 1D index to 2D coordinates
			const x = i % gridWidth;
			const y = Math.floor(i / gridWidth);
			
			const value = randomizedValues[i];
			
			cellElement.style.cssText = `
				width: ${finalCellSize}px;
				height: ${finalCellSize}px;
				background: var(--accent-primary);
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 14px;
				font-weight: 600;
				cursor: pointer;
				transition: all var(--animation-duration-fast, 0.4s) cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				border: 2px solid transparent;
				animation: cellAppear var(--animation-duration, 0.5s) cubic-bezier(0.4, 0, 0.2, 1);
				position: relative;
				z-index: 1;
			`;
			cellElement.textContent = value.toString();
			cellElement.onclick = () => handleCellClick(x, y, { value, type: 'array', x, y });
			gridElement.appendChild(cellElement);
		}
		
		container.appendChild(gridElement);
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
			const gridWidth = currentParams.gridWidth || 10;
			const gridHeight = currentParams.gridHeight || 10;
			const totalCells = gridWidth * gridHeight;
			
			// Create sorted values from 1 to totalCells
			const sortedValues = Array.from({ length: totalCells }, (_, i) => i + 1);
			
			let dataToUse: number[];
			if ($selectedAlgorithm.type === 'search') {
				// For search algorithms, use sorted data (except linear search which can handle unsorted)
				if ($selectedAlgorithm.id === 'linear_search') {
					// Linear search can work with unsorted data - randomize it
					dataToUse = [...sortedValues];
					for (let i = dataToUse.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[dataToUse[i], dataToUse[j]] = [dataToUse[j], dataToUse[i]];
					}
				} else {
					// Other search algorithms need sorted data
					dataToUse = sortedValues;
				}
			} else {
				// For sorting algorithms, randomize the placement of values
				dataToUse = [...sortedValues];
				for (let i = dataToUse.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[dataToUse[i], dataToUse[j]] = [dataToUse[j], dataToUse[i]];
				}
			}

			const config = {
				array_size: totalCells, // Match the actual data length
				speed: 5, // API expects 1-10, use default value
				// Map other parameters to snake_case for API
				grid_width: gridWidth,
				grid_height: gridHeight,
				target_value: currentParams.targetValue,
				num_nodes: currentParams.numNodes,
				num_edges: currentParams.numEdges,
				start_node: currentParams.startNode,
				end_node: currentParams.endNode,
				maze_width: currentParams.mazeWidth,
				maze_height: currentParams.mazeHeight,
				n_queens_size: currentParams.nQueensSize,
				// Include the data for the algorithm to process
				data: dataToUse,
				// For search algorithms, include target in custom_params
				custom_params: $selectedAlgorithm.type === 'search' ? {
					target: currentParams.targetValue || 42
				} : {}
			};

			// First, show the data grid immediately
			renderRandomizedGrid(dataToUse, gridWidth, gridHeight);
			
			// Add a small delay to make the randomization visible
			await new Promise(resolve => setTimeout(resolve, 500));

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
			
			// Show success notification only if modal is not open
			if (!$isModalOpen) {
				showSuccess(
					'Data Generated',
					`Successfully generated ${steps.length} steps for ${$selectedAlgorithm.name}`,
					3000
				);
			}
			
			// Render first step (should show the randomized data)
			if (steps.length > 0) {
				renderStep(steps[0], 0);
			}
			
			// The final step should show the values sorted back to [1, 2, 3, 4, ...]
			console.log('Algorithm will sort randomized values back to original order');
		} catch (error) {
			console.error('Error generating data:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(errorMessage);
			// Show error notification only if modal is not open
			if (!$isModalOpen) {
				showError(
					'Generation Failed',
					`Failed to generate data: ${errorMessage}`,
					5000
				);
			}
		} finally {
			setGenerating(false);
		}
	}

	function play() {
		if (!$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2) return;
		
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
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
	}

	function reset() {
		currentStep = 0;
		isPlaying = false;
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
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
		if (!$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2) return;
		currentStep = Math.max(0, Math.min(step, $execution.steps.length - 1));
		renderStep($execution.steps[currentStep], currentStep);
	}


	function animate() {
		if (!isPlaying || !$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2) return;
		
		// Check if we've reached the end
		if (currentStep >= $execution.steps.length - 1) {
			isPlaying = false;
			return;
		}

		const speed = parseFloat(animationSpeed) || 1; // Default to 1x if empty or invalid
		
		// For ultra-high speeds (32x and above), use requestAnimationFrame with batching
		if (speed >= 32) {
			animateUltraFast();
		} else {
			// For normal to high speeds, use setTimeout
			animateNormal();
		}
	}
	
	function animateNormal() {
		if (!isPlaying || !$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2) return;
		
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
		const speed = parseFloat(animationSpeed) || 1;
		const actualSpeed = Math.max(1, baseSpeed / speed); // Minimum 1ms
		animationTimeout = setTimeout(() => {
			animate();
		}, actualSpeed);
	}
	
	function animateUltraFast() {
		if (!isPlaying || !$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2) return;
		
		const speed = parseFloat(animationSpeed) || 1;
		const stepsPerFrame = Math.max(1, Math.floor(speed / 16)); // Batch multiple steps per frame (adjusted for 32x+ threshold)
		const maxSteps = Math.min(stepsPerFrame, $execution.steps.length - 1 - currentStep);
		
		// Render multiple steps in this frame
		for (let i = 0; i < maxSteps; i++) {
			if (currentStep >= $execution.steps.length - 1) {
				isPlaying = false;
				return;
			}
			currentStep++;
			renderStep($execution.steps[currentStep], currentStep);
		}
		
		// Schedule next frame
		animationFrameId = requestAnimationFrame(() => {
			animate();
		});
	}

	function renderGrid(grid: any[][]) {
		if (!container) return;
		
		container.innerHTML = '';
		
		// Get grid dimensions from parameters
		const currentParams = $parameters;
		const paramGridWidth = currentParams.gridWidth || 10;
		const paramGridHeight = currentParams.gridHeight || 10;
		
		// Calculate responsive cell size
		const containerRect = container.getBoundingClientRect();
		const availableWidth = containerRect.width - 32;
		const availableHeight = containerRect.height - 32;
		
		const cellSize = Math.min(
			Math.floor(availableWidth / paramGridWidth),
			Math.floor(availableHeight / paramGridHeight),
			60
		);
		
		const finalCellSize = Math.max(cellSize, 25);
		
		const gridElement = document.createElement('div');
		gridElement.className = 'grid-container';
		gridElement.style.cssText = `
			display: grid;
			grid-template-columns: repeat(${paramGridWidth}, 1fr);
			grid-template-rows: repeat(${paramGridHeight}, 1fr);
			gap: 2px;
			width: fit-content;
			height: fit-content;
			margin: 0 auto;
			padding: 1rem;
		`;
		
		// Ensure grid has proper dimensions
		for (let y = 0; y < paramGridHeight; y++) {
			for (let x = 0; x < paramGridWidth; x++) {
				const cellElement = document.createElement('div');
				cellElement.className = 'grid-cell';
				
				// Get cell data if available, otherwise create default with sorted value
				const index = y * paramGridWidth + x;
				const cellData = grid[y] && grid[y][x] ? grid[y][x] : { value: index + 1 };
				
				cellElement.style.cssText = `
					width: ${finalCellSize}px;
					height: ${finalCellSize}px;
					background: var(--accent-primary);
					border: 1px solid var(--border-primary);
					border-radius: 4px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: white;
					font-size: 12px;
					font-weight: 600;
					cursor: pointer;
					transition: all var(--transition-normal);
					box-shadow: var(--shadow-xs);
				`;
				cellElement.textContent = cellData.value.toString();
				cellElement.onclick = () => handleCellClick(x, y, cellData);
				gridElement.appendChild(cellElement);
			}
		}
		
		container.appendChild(gridElement);
	}

	// Debounced render function to prevent excessive re-renders
	const debouncedRenderStep = debounce((step: any, stepIndex: number) => {
		if (!container || !step) return;
		
		// Update step info
		let description = step.metadata?.description || `Step ${stepIndex + 1}`;
		
		// Add special styling for found target
		if (step.metadata?.highlight_type === 'found') {
			description = `🎯 ${description}`;
		}
		
		stepDescription = description;
		comparisons = step.metadata?.comparisons || 0;
		swaps = step.metadata?.swaps || 0;
		
		// Render the grid with highlights
		if (step.data && Array.isArray(step.data)) {
			renderGridFromArray(step, stepIndex);
		}
	}, 16); // ~60fps

	function renderStep(step: any, stepIndex: number) {
		// Update step information
		let description = step.metadata?.description || step.action || 'Processing...';
		
		// Add special styling for found target
		if (step.metadata?.highlight_type === 'found') {
			description = `🎯 ${description}`;
		}
		
		stepDescription = description;
		
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
		
		// Debug: Log highlights to understand the data structure
		if (step.highlights && step.highlights.length > 0) {
			console.log('Step highlights:', step.highlights, 'Type:', typeof step.highlights[0]);
		}
		
		container.innerHTML = '';
		
		// Get grid dimensions from parameters
		const currentParams = $parameters;
		const paramGridWidth = currentParams.gridWidth || 10;
		const paramGridHeight = currentParams.gridHeight || 10;
		
		// Calculate responsive grid dimensions
		const containerRect = container.getBoundingClientRect();
		const availableWidth = containerRect.width - 32; // Account for padding
		const availableHeight = containerRect.height - 32;
		
		// Use parameter dimensions instead of calculating from data length
		const cellSize = Math.min(
			Math.floor(availableWidth / paramGridWidth),
			Math.floor(availableHeight / paramGridHeight),
			60 // Maximum cell size to prevent overflow
		);
		
		// Ensure minimum cell size for readability
		const minCellSize = 25;
		const finalCellSize = Math.max(cellSize, minCellSize);
		
		const gridElement = document.createElement('div');
		gridElement.className = 'responsive-grid';
		gridElement.style.cssText = `
			display: grid;
			grid-template-columns: repeat(${paramGridWidth}, 1fr);
			grid-template-rows: repeat(${paramGridHeight}, 1fr);
			gap: 2px;
			width: fit-content;
			height: fit-content;
			max-width: 100%;
			max-height: 100%;
			margin: 0 auto;
			justify-content: center;
			align-items: center;
		`;
		
		// Create a proper 2D grid structure
		const totalCells = paramGridWidth * paramGridHeight;
		
		for (let i = 0; i < totalCells; i++) {
			const cellElement = document.createElement('div');
			cellElement.className = 'grid-cell';
			
			// Convert 1D index to 2D coordinates using parameter dimensions
			const x = i % paramGridWidth;
			const y = Math.floor(i / paramGridWidth);
			
			// Get value from step data if available, otherwise use sorted sequence
			const value = step.data && step.data[i] !== undefined ? step.data[i] : i + 1;
			const isHighlighted = step.highlights?.includes(i) || false;
			const highlightIndex = step.highlights?.indexOf(i) ?? -1;
			
			// Determine cell styling based on highlight status
			let backgroundColor = 'var(--accent-primary)';
			let boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
			let border = '2px solid transparent';
			
			if (isHighlighted && highlightIndex >= 0) {
				// Check highlight type for search algorithms
				const highlightType = step.metadata?.highlight_type;
				if (highlightType === 'found') {
					// Special styling for found target
					backgroundColor = '#10b981'; // Emerald green
					boxShadow = `0 0 20px #10b981, 0 0 40px #10b98180`; // Double glow effect
					border = '3px solid #059669'; // Darker green border
				} else if (highlightType === 'target') {
					// Red highlighting for target value
					backgroundColor = '#ef4444'; // Red
					boxShadow = `0 0 15px #ef4444, 0 0 30px #ef444480`; // Red glow
					border = '3px solid #dc2626'; // Darker red border
				} else if (highlightType === 'searching') {
					// Green highlighting for search attempts
					backgroundColor = '#22c55e'; // Green
					boxShadow = `0 0 15px #22c55e, 0 0 30px #22c55e80`; // Green glow
					border = '2px solid #16a34a'; // Darker green border
				} else {
					// Regular highlight
					const highlightColor = getHighlightColor(highlightIndex);
					backgroundColor = highlightColor;
					boxShadow = `0 0 15px ${highlightColor}80`;
					border = `2px solid ${highlightColor}`;
				}
			} else if (isHighlighted) {
				// Fallback for highlighted cells without valid index
				backgroundColor = highlightColors[0]; // Use first color (green)
				boxShadow = `0 0 15px ${highlightColors[0]}80`;
				border = `2px solid ${highlightColors[0]}`;
			}
			
			cellElement.style.cssText = `
				width: ${finalCellSize}px;
				height: ${finalCellSize}px;
				background: ${backgroundColor};
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 14px;
				font-weight: 600;
				cursor: pointer;
				transition: all var(--animation-duration-fast, 0.4s) cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: ${boxShadow};
				border: ${border};
				animation: cellAppear var(--animation-duration, 0.5s) cubic-bezier(0.4, 0, 0.2, 1);
				position: relative;
				z-index: 1;
			`;
			cellElement.textContent = value.toString();
			cellElement.onclick = () => handleCellClick(x, y, { value, type: 'array', x, y });
			gridElement.appendChild(cellElement);
		}
		
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
			const highlightIndex = step.highlights?.indexOf(index) ?? -1;
			const height = (value / 100) * 150; // Scale to fit container
			
			// Determine bar styling based on highlight status
			let backgroundColor = 'var(--accent-primary)';
			let boxShadow = 'none';
			
			if (isHighlighted && highlightIndex >= 0) {
				// Check highlight type for search algorithms
				const highlightType = step.metadata?.highlight_type;
				if (highlightType === 'found') {
					// Special styling for found target
					backgroundColor = '#10b981'; // Emerald green
					boxShadow = `0 0 15px #10b981, 0 0 30px #10b98190`; // Double glow effect
				} else if (highlightType === 'target') {
					// Red highlighting for target value
					backgroundColor = '#ef4444'; // Red
					boxShadow = `0 0 15px #ef4444, 0 0 30px #ef444490`; // Red glow
				} else if (highlightType === 'searching') {
					// Green highlighting for search attempts
					backgroundColor = '#22c55e'; // Green
					boxShadow = `0 0 15px #22c55e, 0 0 30px #22c55e90`; // Green glow
				} else {
					// Regular highlight
					const highlightColor = getHighlightColor(highlightIndex);
					backgroundColor = highlightColor;
					boxShadow = `0 0 10px ${highlightColor}90`;
				}
			} else if (isHighlighted) {
				// Fallback for highlighted bars without valid index
				backgroundColor = highlightColors[0]; // Use first color (green)
				boxShadow = `0 0 10px ${highlightColors[0]}90`;
			}
			
			barElement.style.cssText = `
				width: 20px;
				height: ${height}px;
				background: ${backgroundColor};
				border-radius: 2px;
				display: flex;
				align-items: end;
				justify-content: center;
				color: white;
				font-size: 10px;
				font-weight: 600;
				transition: all 0.3s;
				box-shadow: ${boxShadow};
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

	// Watch for parameter changes and update grid
	$effect(() => {
		if (isInitialized && $parameters) {
			showBlankGrid();
		}
	});
</script>

<div class="grid-visualizer-container">


	<div class="grid-container" bind:this={container}>
		{#if !isInitialized}
			<div class="loading">Initializing grid visualizer...</div>
		{/if}
		
		<!-- Top Step Description -->
		{#if stepDescription}
			<div class="top-step-description">
				<div class="step-info-content">
					<span class="step-label">Step {currentStep + 1} of {Math.max(totalSteps, 1)}:</span>
					<span class="step-text">{stepDescription}</span>
				</div>
				{#if comparisons > 0 || swaps > 0}
					<div class="step-stats">
						{#if comparisons > 0}
							<span class="stat-item">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21Z"/>
								</svg>
								{comparisons} comparisons
							</span>
						{/if}
						{#if swaps > 0}
							<span class="stat-item">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 3H18C16.8954 3 16 3.89543 16 5V8M21 16V19C21 20.1046 20.1046 21 19 21H16M8 21H5C3.89543 21 3 20.1046 3 19V16"/>
									<path d="M9 9L15 15M15 9L9 15"/>
								</svg>
								{swaps} swaps
							</span>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
		
		<!-- Floating Step Info (keeping for backward compatibility) -->
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
				disabled={!$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2}
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
				disabled={!$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2}
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
				disabled={!$execution || $execution.steps.length === 0 || totalSteps === 0 || totalSteps < 2}
			/>
			<div class="step-display">
				Step {currentStep + 1} of {Math.max(totalSteps, 1)}
		</div>
	</div>

		<div class="speed-group">
			<select 
				bind:value={animationSpeed} 
				class="speed-select"
			>
				<option value="" disabled selected>Mult</option>
				<option value="1">1x</option>
				<option value="2">2x</option>
				<option value="4">4x</option>
				<option value="8">8x</option>
				<option value="16">16x</option>
				<option value="32">32x</option>
				<option value="64">64x</option>
				<option value="128">128x</option>
				<option value="256">256x</option>
				<option value="512">512x</option>
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
		max-height: 100vh;
		background: var(--bg-primary);
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--border-primary);
		transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
		padding-right: 1rem;
		box-sizing: border-box;
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

	/* Top Step Description Styles */
	.top-step-description {
		position: absolute;
		top: 1rem;
		left: 1rem;
		right: 1rem;
		background: var(--bg-primary);
		backdrop-filter: blur(8px);
		padding: 1rem 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border-primary);
		box-shadow: var(--shadow-xl);
		z-index: 10;
		pointer-events: none;
		transition: all 0.3s ease;
	}

	.step-info-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.step-label {
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.step-text {
		color: var(--text-primary);
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.4;
	}

	.step-stats {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		background: var(--bg-tertiary);
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid var(--border-primary);
		transition: all 0.3s ease;
	}

	.stat-item svg {
		color: var(--accent-primary);
		flex-shrink: 0;
	}

	.grid-container {
		flex: 1;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		max-height: calc(100vh - 200px);
		padding: 1rem 1.5rem 1rem 1rem;
		box-sizing: border-box;
		background: var(--bg-primary);
		border-radius: 4px;
		margin: 1rem;
		box-shadow: var(--shadow-sm);
		transition: all var(--transition-slow);
		overflow: auto;
		width: 100%;
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
		margin-top: auto;
		gap: 1rem;
		box-shadow: var(--shadow-md);
		border: 1px solid var(--border-primary);
		transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
		flex-shrink: 0;
		min-height: 60px;
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
		.grid-visualizer-container {
			padding-right: 0.75rem;
		}
		
		.grid-container {
			padding: 0.5rem 0.75rem 0.5rem 0.5rem;
			min-height: 300px;
		}

		.top-step-description {
			top: 0.5rem;
			left: 0.5rem;
			right: 0.5rem;
			padding: 0.75rem 1rem;
		}

		.step-label {
			font-size: 0.75rem;
		}

		.step-text {
			font-size: 0.875rem;
		}

		.step-stats {
			gap: 0.5rem;
		}

		.stat-item {
			font-size: 0.75rem;
			padding: 0.375rem 0.5rem;
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
		.grid-visualizer-container {
			padding-right: 0.5rem;
		}
		
		.grid-container {
			padding: 0.25rem 0.5rem 0.25rem 0.25rem;
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

	/* Responsive Grid Styles - These classes are applied dynamically via JavaScript */
	/* svelte-ignore css_unused_selector */
	.responsive-grid {
		display: grid;
		gap: 2px;
		width: fit-content;
		height: fit-content;
		max-width: 100%;
		max-height: 100%;
		margin: 0 auto;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	/* svelte-ignore css_unused_selector */
	.grid-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-normal);
		border-radius: 8px;
		font-weight: 600;
		position: relative;
		z-index: 1;
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
