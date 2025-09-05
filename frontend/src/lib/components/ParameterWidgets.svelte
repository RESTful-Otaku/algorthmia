<script lang="ts">
	import { selectedAlgorithm, setParameters } from '$lib/stores/app';
	import type { Algorithm } from '$lib/types';

	let gridWidth = $state(10);
	let gridHeight = $state(10);
	let arraySize = $state(20);
	let targetValue = $state(50);
	let mazeWidth = $state(15);
	let mazeHeight = $state(15);
	let numNodes = $state(8);
	let numEdges = $state(12);
	let startNode = $state(0);
	let endNode = $state(7);
	let nQueensSize = $state(8);

	function getAlgorithmParameters() {
		if (!$selectedAlgorithm) return {};

		const baseParams = {
			gridWidth,
			gridHeight
		};

		switch ($selectedAlgorithm.category) {
			case 'Sorting':
			case 'Search':
				return {
					...baseParams,
					arraySize,
					targetValue: $selectedAlgorithm.category === 'Search' ? targetValue : undefined
				};
			case 'Graph':
				return {
					...baseParams,
					numNodes,
					numEdges,
					startNode,
					endNode
				};
			case 'Advanced':
				if ($selectedAlgorithm.id?.includes('maze')) {
					return {
						...baseParams,
						mazeWidth,
						mazeHeight
					};
				}
				if ($selectedAlgorithm.id?.includes('n-queens')) {
					return {
						...baseParams,
						nQueensSize
					};
				}
				return baseParams;
			default:
				return baseParams;
		}
	}

	function resetToDefaults() {
		gridWidth = 10;
		gridHeight = 10;
		arraySize = 20;
		targetValue = 50;
		mazeWidth = 15;
		mazeHeight = 15;
		numNodes = 8;
		numEdges = 12;
		startNode = 0;
		endNode = 7;
		nQueensSize = 8;
		
		// Update the store
		setParameters(getAlgorithmParameters());
	}

	function clampValue(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	// Reactive statements to clamp values
	$effect(() => {
		gridWidth = clampValue(gridWidth, 5, 50);
		gridHeight = clampValue(gridHeight, 5, 50);
		arraySize = clampValue(arraySize, 5, 50);
		targetValue = clampValue(targetValue, 1, 100);
		numNodes = clampValue(numNodes, 3, 20);
		numEdges = clampValue(numEdges, 2, 30);
		startNode = clampValue(startNode, 0, numNodes - 1);
		endNode = clampValue(endNode, 0, numNodes - 1);
		mazeWidth = clampValue(mazeWidth, 5, 30);
		mazeHeight = clampValue(mazeHeight, 5, 30);
		nQueensSize = clampValue(nQueensSize, 4, 12);
		
		// Update the store whenever parameters change
		setParameters(getAlgorithmParameters());
	});

	function randomizeParameters() {
		if (!$selectedAlgorithm) return;

		switch ($selectedAlgorithm.category) {
			case 'Sorting':
			case 'Search':
				arraySize = clampValue(Math.floor(Math.random() * 20) + 10, 5, 50);
				targetValue = clampValue(Math.floor(Math.random() * 100) + 1, 1, 100);
				break;
			case 'Graph':
				numNodes = clampValue(Math.floor(Math.random() * 10) + 5, 3, 20);
				numEdges = clampValue(Math.floor(Math.random() * 15) + 8, 2, 30);
				startNode = 0;
				endNode = clampValue(Math.max(1, numNodes - 1), 0, numNodes - 1);
				break;
			case 'Advanced':
				if ($selectedAlgorithm.id?.includes('maze')) {
					mazeWidth = clampValue(Math.floor(Math.random() * 10) + 10, 5, 30);
					mazeHeight = clampValue(Math.floor(Math.random() * 10) + 10, 5, 30);
				}
				if ($selectedAlgorithm.id?.includes('n-queens')) {
					nQueensSize = clampValue(Math.floor(Math.random() * 6) + 4, 4, 12);
				}
				break;
		}
		
		// Update the store
		setParameters(getAlgorithmParameters());
	}
</script>

{#if $selectedAlgorithm}
	<div class="parameter-widgets">
		<div class="widget-header">
			<h3 class="widget-title">Parameters</h3>
			<div class="widget-actions">
				<button class="action-btn" onclick={resetToDefaults} title="Reset to defaults" aria-label="Reset to defaults">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"></path>
					</svg>
				</button>
				<button class="action-btn" onclick={randomizeParameters} title="Randomize" aria-label="Randomize parameters">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
					</svg>
				</button>
			</div>
		</div>

		<div class="widget-content">
			<!-- Grid Size (always shown) -->
			<fieldset class="parameter-group">
				<legend class="parameter-label">Grid Size</legend>
				<div class="parameter-controls">
					<div class="parameter-control">
						<label class="control-label" for="grid-width">Width: {gridWidth}</label>
						<input
							id="grid-width"
							type="range"
							bind:value={gridWidth}
							min="5"
							max="50"
							class="control-slider"
						/>
						<div class="slider-labels">
							<span>5</span>
							<span>50</span>
						</div>
					</div>
					<div class="parameter-control">
						<label class="control-label" for="grid-height">Height: {gridHeight}</label>
						<input
							id="grid-height"
							type="range"
							bind:value={gridHeight}
							min="5"
							max="50"
							class="control-slider"
						/>
						<div class="slider-labels">
							<span>5</span>
							<span>50</span>
						</div>
					</div>
				</div>
			</fieldset>

			<!-- Sorting/Search Parameters -->
			{#if $selectedAlgorithm.category === 'Sorting' || $selectedAlgorithm.category === 'Search'}
				<fieldset class="parameter-group">
					<legend class="parameter-label">Array Size</legend>
					<div class="parameter-controls">
						<input
							id="array-size"
							type="range"
							bind:value={arraySize}
							min="5"
							max="50"
							class="control-slider"
						/>
						<span class="control-value">{arraySize}</span>
					</div>
				</fieldset>

				{#if $selectedAlgorithm.category === 'Search'}
					<fieldset class="parameter-group">
						<legend class="parameter-label">Target Value</legend>
						<div class="parameter-controls">
							<label class="control-label" for="target-value">Value: {targetValue}</label>
							<input
								id="target-value"
								type="range"
								bind:value={targetValue}
								min="1"
								max="100"
								class="control-slider"
							/>
							<div class="slider-labels">
								<span>1</span>
								<span>100</span>
							</div>
						</div>
					</fieldset>
				{/if}
			{/if}

			<!-- Graph Parameters -->
			{#if $selectedAlgorithm.category === 'Graph'}
				<fieldset class="parameter-group">
					<legend class="parameter-label">Graph Size</legend>
					<div class="parameter-controls">
						<div class="parameter-control">
							<label class="control-label" for="num-nodes">Nodes: {numNodes}</label>
							<input
								id="num-nodes"
								type="range"
								bind:value={numNodes}
								min="3"
								max="20"
								class="control-slider"
							/>
							<div class="slider-labels">
								<span>3</span>
								<span>20</span>
							</div>
						</div>
						<div class="parameter-control">
							<label class="control-label" for="num-edges">Edges: {numEdges}</label>
							<input
								id="num-edges"
								type="range"
								bind:value={numEdges}
								min="2"
								max="30"
								class="control-slider"
							/>
							<div class="slider-labels">
								<span>2</span>
								<span>30</span>
							</div>
						</div>
					</div>
				</fieldset>

				<fieldset class="parameter-group">
					<legend class="parameter-label">Pathfinding</legend>
					<div class="parameter-controls">
						<div class="parameter-control">
							<label class="control-label" for="start-node">Start Node: {startNode}</label>
							<input
								id="start-node"
								type="range"
								bind:value={startNode}
								min="0"
								max={numNodes - 1}
								class="control-slider"
							/>
							<div class="slider-labels">
								<span>0</span>
								<span>{numNodes - 1}</span>
							</div>
						</div>
						<div class="parameter-control">
							<label class="control-label" for="end-node">End Node: {endNode}</label>
							<input
								id="end-node"
								type="range"
								bind:value={endNode}
								min="0"
								max={numNodes - 1}
								class="control-slider"
							/>
							<div class="slider-labels">
								<span>0</span>
								<span>{numNodes - 1}</span>
							</div>
						</div>
					</div>
				</fieldset>
			{/if}

			<!-- Advanced Algorithm Parameters -->
			{#if $selectedAlgorithm.category === 'Advanced'}
				{#if $selectedAlgorithm.id?.includes('maze')}
					<fieldset class="parameter-group">
						<legend class="parameter-label">Maze Size</legend>
						<div class="parameter-controls">
							<div class="parameter-control">
								<label class="control-label" for="maze-width">Width: {mazeWidth}</label>
								<input
									id="maze-width"
									type="range"
									bind:value={mazeWidth}
									min="5"
									max="30"
									class="control-slider"
								/>
								<div class="slider-labels">
									<span>5</span>
									<span>30</span>
								</div>
							</div>
							<div class="parameter-control">
								<label class="control-label" for="maze-height">Height: {mazeHeight}</label>
								<input
									id="maze-height"
									type="range"
									bind:value={mazeHeight}
									min="5"
									max="30"
									class="control-slider"
								/>
								<div class="slider-labels">
									<span>5</span>
									<span>30</span>
								</div>
							</div>
						</div>
					</fieldset>
				{/if}

				{#if $selectedAlgorithm.id?.includes('n-queens')}
					<fieldset class="parameter-group">
						<legend class="parameter-label">Board Size</legend>
						<div class="parameter-controls">
							<input
								id="n-queens-size"
								type="range"
								bind:value={nQueensSize}
								min="4"
								max="12"
								class="control-slider"
							/>
							<span class="control-value">{nQueensSize}x{nQueensSize}</span>
						</div>
					</fieldset>
				{/if}
			{/if}

			<!-- Interactive Grid Hint -->
			<div class="parameter-hint">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>You can also click on the grid to interact with it directly</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.parameter-widgets {
		background: var(--bg-primary);
		border-radius: 4px;
		border: 1px solid var(--border-primary);
		overflow: hidden;
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-sm);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.parameter-widgets:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--border-secondary);
	}

	.widget-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem;
		background: var(--bg-tertiary);
		border-bottom: 1px solid var(--border-primary);
		transition: all var(--transition-normal);
	}

	.widget-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		letter-spacing: -0.025em;
		transition: color var(--transition-normal);
	}

	.widget-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		padding: 0.5rem;
		border: none;
		background: var(--bg-quaternary);
		border-radius: 4px;
		cursor: pointer;
		color: var(--text-secondary);
		transition: all var(--transition-normal);
		box-shadow: var(--shadow-xs);
	}

	.action-btn:hover {
		background: var(--border-primary);
		color: var(--text-primary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.action-btn:active {
		transform: translateY(0);
		box-shadow: var(--shadow-xs);
	}

	.widget-content {
		padding: 1rem;
	}

	.parameter-group {
		margin-bottom: 1.5rem;
	}

	.parameter-group:last-child {
		margin-bottom: 0;
	}

	.parameter-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
		letter-spacing: -0.025em;
		transition: color var(--transition-normal);
	}

	.parameter-controls {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.parameter-control {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: var(--bg-tertiary);
		border-radius: 4px;
		border: 1px solid var(--border-primary);
		transition: all var(--transition-normal);
	}

	.parameter-control:hover {
		background: var(--bg-quaternary);
		border-color: var(--border-secondary);
		box-shadow: var(--shadow-sm);
	}

	.control-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.025em;
		transition: color var(--transition-normal);
	}


	.control-slider {
		width: 100%;
		height: 8px;
		border-radius: 4px;
		background: var(--bg-quaternary);
		transition: all var(--transition-normal);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.control-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent-primary);
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.control-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent-primary);
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.control-value {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		text-align: center;
		padding: 0.25rem 0.5rem;
		background: var(--bg-tertiary);
		border-radius: 0.25rem;
		min-width: 3rem;
	}

	.slider-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin-top: 0.25rem;
	}

	.parameter-hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: var(--accent-lighter);
		border: 1px solid var(--accent-light);
		border-radius: 4px;
		font-size: 0.75rem;
		color: var(--accent-primary);
		margin-top: 1rem;
	}

	/* Animations */
	@keyframes fadeInUp {
		from { 
			opacity: 0;
			transform: translateY(20px);
		}
		to { 
			opacity: 1;
			transform: translateY(0);
		}
	}

</style>
