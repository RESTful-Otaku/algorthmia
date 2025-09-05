<script lang="ts">
	import { selectedAlgorithm } from '$lib/stores/app';
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
	}

	function randomizeParameters() {
		if (!$selectedAlgorithm) return;

		switch ($selectedAlgorithm.category) {
			case 'Sorting':
			case 'Search':
				arraySize = Math.floor(Math.random() * 20) + 10; // 10-30
				targetValue = Math.floor(Math.random() * 100) + 1; // 1-100
				break;
			case 'Graph':
				numNodes = Math.floor(Math.random() * 10) + 5; // 5-15
				numEdges = Math.floor(Math.random() * 15) + 8; // 8-23
				startNode = 0;
				endNode = Math.max(1, numNodes - 1);
				break;
			case 'Advanced':
				if ($selectedAlgorithm.id?.includes('maze')) {
					mazeWidth = Math.floor(Math.random() * 10) + 10; // 10-20
					mazeHeight = Math.floor(Math.random() * 10) + 10; // 10-20
				}
				if ($selectedAlgorithm.id?.includes('n-queens')) {
					nQueensSize = Math.floor(Math.random() * 6) + 4; // 4-10
				}
				break;
		}
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
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"></path>
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
						<label class="control-label" for="grid-width">Width</label>
						<input
							id="grid-width"
							type="number"
							bind:value={gridWidth}
							min="5"
							max="50"
							class="control-input"
						/>
					</div>
					<div class="parameter-control">
						<label class="control-label" for="grid-height">Height</label>
						<input
							id="grid-height"
							type="number"
							bind:value={gridHeight}
							min="5"
							max="50"
							class="control-input"
						/>
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
							<input
								id="target-value"
								type="number"
								bind:value={targetValue}
								min="1"
								max="100"
								class="control-input"
							/>
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
							<label class="control-label" for="num-nodes">Nodes</label>
							<input
								id="num-nodes"
								type="number"
								bind:value={numNodes}
								min="3"
								max="20"
								class="control-input"
							/>
						</div>
						<div class="parameter-control">
							<label class="control-label" for="num-edges">Edges</label>
							<input
								id="num-edges"
								type="number"
								bind:value={numEdges}
								min="2"
								max="30"
								class="control-input"
							/>
						</div>
					</div>
				</fieldset>

				<fieldset class="parameter-group">
					<legend class="parameter-label">Pathfinding</legend>
					<div class="parameter-controls">
						<div class="parameter-control">
							<label class="control-label" for="start-node">Start Node</label>
							<input
								id="start-node"
								type="number"
								bind:value={startNode}
								min="0"
								max={numNodes - 1}
								class="control-input"
							/>
						</div>
						<div class="parameter-control">
							<label class="control-label" for="end-node">End Node</label>
							<input
								id="end-node"
								type="number"
								bind:value={endNode}
								min="0"
								max={numNodes - 1}
								class="control-input"
							/>
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
								<label class="control-label" for="maze-width">Width</label>
								<input
									id="maze-width"
									type="number"
									bind:value={mazeWidth}
									min="5"
									max="30"
									class="control-input"
								/>
							</div>
							<div class="parameter-control">
								<label class="control-label" for="maze-height">Height</label>
								<input
									id="maze-height"
									type="number"
									bind:value={mazeHeight}
									min="5"
									max="30"
									class="control-input"
								/>
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
		background: white;
		border-radius: 0.75rem;
		border: 1px solid #e5e7eb;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.widget-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #f9fafb;
		border-bottom: 1px solid #e5e7eb;
	}

	.widget-title {
		font-size: 1rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
	}

	.widget-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		padding: 0.5rem;
		border: none;
		background: #f3f4f6;
		border-radius: 0.375rem;
		cursor: pointer;
		color: #6b7280;
		transition: all 0.2s;
	}

	.action-btn:hover {
		background: #e5e7eb;
		color: #374151;
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
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.75rem;
	}

	.parameter-controls {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.parameter-control {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.control-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: #6b7280;
	}

	.control-input {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		transition: border-color 0.2s;
	}

	.control-input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.control-slider {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #e5e7eb;
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
		background: #3b82f6;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.control-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.control-value {
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
		text-align: center;
		padding: 0.25rem 0.5rem;
		background: #f3f4f6;
		border-radius: 0.25rem;
		min-width: 3rem;
	}

	.parameter-hint {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		color: #1e40af;
		margin-top: 1rem;
	}

	/* Dark mode styles */
	:global(.dark) .parameter-widgets {
		background: #1f2937;
		border-color: #374151;
	}

	:global(.dark) .widget-header {
		background: #374151;
		border-bottom-color: #4b5563;
	}

	:global(.dark) .widget-title {
		color: #f9fafb;
	}

	:global(.dark) .action-btn {
		background: #4b5563;
		color: #9ca3af;
	}

	:global(.dark) .action-btn:hover {
		background: #6b7280;
		color: #f9fafb;
	}

	:global(.dark) .parameter-label {
		color: #d1d5db;
	}

	:global(.dark) .control-label {
		color: #9ca3af;
	}

	:global(.dark) .control-input {
		background: #111827;
		border-color: #374151;
		color: #f9fafb;
	}

	:global(.dark) .control-input:focus {
		border-color: #3b82f6;
	}

	:global(.dark) .control-slider {
		background: #4b5563;
	}

	:global(.dark) .control-value {
		background: #4b5563;
		color: #f9fafb;
	}

	:global(.dark) .parameter-hint {
		background: #1e3a8a;
		border-color: #3b82f6;
		color: #93c5fd;
	}
</style>
