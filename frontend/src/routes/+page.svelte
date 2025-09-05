<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import GridAlgorithmVisualizer from '$lib/components/GridAlgorithmVisualizer.svelte';
	import YouTubeScrubber from '$lib/components/YouTubeScrubber.svelte';
	import ParameterWidgets from '$lib/components/ParameterWidgets.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import NotificationContainer from '$lib/components/NotificationContainer.svelte';
	import { 
		algorithms, 
		selectedAlgorithm, 
		controlState, 
		sidePanelState,
		execution,
		setAlgorithms,
		setLoading,
		setError,
		addNotification
	} from '$lib/stores/app';
	import { api, APIError } from '$lib/api';

	let showWelcomeModal = $state(true);
	let showHints = $state(true);
	let hasGeneratedData = $derived($execution && $execution.steps.length > 0);

	onMount(async () => {
		try {
			setLoading(true);
			const fetchedAlgorithms = await api.getAlgorithms();
			setAlgorithms(fetchedAlgorithms);
			addNotification({
				type: 'success',
				title: 'Welcome!',
				message: 'Algorithm Visualizer loaded successfully. Select an algorithm to get started.',
				duration: 3000,
			});
		} catch (err) {
			const errorMessage = err instanceof APIError ? err.message : 'Failed to load algorithms';
			setError(errorMessage);
			addNotification({
				type: 'error',
				title: 'Error',
				message: errorMessage,
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}

		// Check if user has seen welcome modal before
		if (browser) {
			const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
			if (hasSeenWelcome === 'true') {
				showWelcomeModal = false;
			}
		}
	});

	function handleWelcomeClose() {
		showWelcomeModal = false;
		if (browser) {
			localStorage.setItem('hasSeenWelcome', 'true');
		}
	}

	function toggleHints() {
		showHints = !showHints;
	}
</script>

<!-- Welcome Modal -->
{#if showWelcomeModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4">
			<h2 class="text-2xl font-bold mb-4">Welcome to Algorithm Visualizer</h2>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Explore and visualize various algorithms with interactive controls and real-time animations.
			</p>
			<button 
				onclick={handleWelcomeClose}
				class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
			>
				Get Started
			</button>
		</div>
	</div>
{/if}

<!-- Hint Notifications -->
{#if showHints}
	<div class="fixed top-4 right-4 z-40">
		<div class="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 max-w-sm">
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
						Getting Started
					</h3>
					<div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
						<p>Select an algorithm from the sidebar, adjust parameters, and click Generate to start visualizing!</p>
					</div>
					<div class="mt-4">
						<div class="-mx-2 -my-1.5 flex">
							<button 
								onclick={toggleHints}
								class="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-md p-1.5 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900 focus:ring-blue-600"
							>
								Dismiss
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="main-container">
	<!-- Left Panel - Algorithm Selection and Parameters -->
	<div class="left-panel">
		<div class="panel-content">
			<!-- Algorithm Selector -->
			<SidePanel />

			<!-- Algorithm Description -->
			{#if $selectedAlgorithm}
				<div class="algorithm-description">
					<h3 class="description-title">{$selectedAlgorithm.name}</h3>
					<p class="description-text">{$selectedAlgorithm.description}</p>
					<div class="complexity-info">
						<span class="complexity-item">
							<strong>Time:</strong> {$selectedAlgorithm.time_complexity}
						</span>
						<span class="complexity-item">
							<strong>Space:</strong> {$selectedAlgorithm.space_complexity}
						</span>
					</div>
				</div>
			{/if}

			<!-- Parameter Widgets -->
			<ParameterWidgets />

			<!-- Control Buttons -->
			<div class="control-buttons">
				<button 
					class="btn btn-primary btn-large"
					disabled={!$selectedAlgorithm}
					onclick={() => {
						// This will be handled by the GridAlgorithmVisualizer
						if (browser) {
							const event = new CustomEvent('generateData');
							window.dispatchEvent(event);
						}
					}}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"></path>
					</svg>
					Generate Data
				</button>

				<button 
					class="btn btn-secondary"
					disabled={!hasGeneratedData}
					onclick={() => {
						if (browser) {
							const event = new CustomEvent('resetData');
							window.dispatchEvent(event);
						}
					}}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15"></path>
					</svg>
					Reset
				</button>
			</div>
		</div>
	</div>

	<!-- Right Panel - Visualization Area -->
	<div class="right-panel">
		<div class="visualization-container">
			<!-- Grid Visualizer -->
			<GridAlgorithmVisualizer />

			<!-- Video Player Controls -->
			{#if hasGeneratedData}
				<div class="player-controls">
					<YouTubeScrubber />
				</div>
			{/if}
		</div>
	</div>
</div>

<NotificationContainer />

<style>
	.main-container {
		display: flex;
		height: 100vh;
		background: #f9fafb;
	}

	.left-panel {
		width: 400px;
		background: white;
		border-right: 1px solid #e5e7eb;
		overflow-y: auto;
	}

	.panel-content {
		padding: 1.5rem;
	}

	.algorithm-description {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.description-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #1e293b;
		margin: 0 0 0.5rem 0;
	}

	.description-text {
		font-size: 0.875rem;
		color: #64748b;
		line-height: 1.6;
		margin: 0 0 1rem 0;
	}

	.complexity-info {
		display: flex;
		gap: 1rem;
	}

	.complexity-item {
		font-size: 0.75rem;
		color: #64748b;
	}

	.complexity-item strong {
		color: #475569;
	}

	.control-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2563eb;
	}

	.btn-secondary {
		background: #f3f4f6;
		color: #374151;
		border: 1px solid #d1d5db;
	}

	.btn-secondary:hover:not(:disabled) {
		background: #e5e7eb;
	}

	.btn-large {
		padding: 1rem 1.5rem;
		font-size: 1rem;
	}

	.right-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: #1a202c;
	}

	.visualization-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.player-controls {
		background: #2d3748;
		border-top: 1px solid #4a5568;
	}

	/* Dark mode styles */
	:global(.dark) .main-container {
		background: #111827;
	}

	:global(.dark) .left-panel {
		background: #1f2937;
		border-right-color: #374151;
	}

	:global(.dark) .algorithm-description {
		background: #374151;
		border-color: #4b5563;
	}

	:global(.dark) .description-title {
		color: #f9fafb;
	}

	:global(.dark) .description-text {
		color: #d1d5db;
	}

	:global(.dark) .complexity-item {
		color: #9ca3af;
	}

	:global(.dark) .complexity-item strong {
		color: #d1d5db;
	}

	:global(.dark) .btn-secondary {
		background: #374151;
		color: #d1d5db;
		border-color: #4b5563;
	}

	:global(.dark) .btn-secondary:hover:not(:disabled) {
		background: #4b5563;
	}

	:global(.dark) .right-panel {
		background: #0f172a;
	}

	:global(.dark) .player-controls {
		background: #1e293b;
		border-top-color: #334155;
	}
</style>
