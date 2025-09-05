<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Fuse from 'fuse.js';
	import Header from '$lib/components/Header.svelte';
	import GridAlgorithmVisualizer from '$lib/components/GridAlgorithmVisualizer.svelte';
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
		addNotification,
		showError,
		showInfo,
		selectAlgorithm,
		filteredAlgorithms
	} from '$lib/stores/app';
	import { api, APIError } from '$lib/api';

	let showWelcomeModal = $state(true);
	let showHints = $state(true);
	let currentIntroStep = $state(0);
	let introSteps = [
		{
			title: "Welcome to Algorithm Visualizer",
			description: "Explore and visualize various algorithms with interactive controls and real-time animations.",
			icon: "🚀"
		},
		{
			title: "Select an Algorithm",
			description: "Choose from sorting, searching, and graph algorithms in the left panel. Each algorithm has detailed complexity information.",
			icon: "🔍"
		},
		{
			title: "Configure Parameters",
			description: "Adjust array size, speed, and other parameters to customize your visualization experience.",
			icon: "⚙️"
		},
		{
			title: "Watch & Control",
			description: "Use the video player controls to play, pause, scrub through steps, and adjust animation speed.",
			icon: "🎮"
		},
		{
			title: "Learn & Explore",
			description: "Each step shows comparisons, swaps, and detailed descriptions to help you understand how algorithms work.",
			icon: "📚"
		}
	];
	
	// Collapsible section states (default to expanded)
	let isAlgorithmSectionOpen = $state(true);
	let isParameterSectionOpen = $state(true);
	
	// Search functionality
	let searchQuery = $state('');
	let fuse: Fuse<any> | null = null;
	
	// Responsive layout states
	let isLeftPanelOpen = $state(true);
	let isMobile = $state(false);
	let isTablet = $state(false);

	onMount(async () => {
		// Load algorithms first, don't block on modal
		try {
			setLoading(true);
			const fetchedAlgorithms = await api.getAlgorithms();
			setAlgorithms(fetchedAlgorithms);
			
			// Initialize Fuse.js after algorithms are loaded
			initializeFuse();
			
			addNotification({
				type: 'success',
				title: 'Welcome!',
				message: 'Algorithm Visualizer loaded successfully. Select an algorithm to get started.',
				duration: 3000,
			});
		} catch (err) {
			const errorMessage = err instanceof APIError ? err.message : 'Failed to load algorithms';
			setError(errorMessage);
			showError(
				'Loading Failed',
				errorMessage,
				5000
			);
		} finally {
			setLoading(false);
		}

		// Set up responsive breakpoints
		function updateResponsiveState() {
			if (browser) {
				const width = window.innerWidth;
				const wasMobile = isMobile;
				isMobile = width < 768;
				isTablet = width >= 768 && width < 1024;
				
				// On mobile, start with left panel closed (overlay hidden)
				if (isMobile) {
					isLeftPanelOpen = false;
				} else if (wasMobile && !isMobile) {
					// When resizing back from mobile to desktop, ensure left panel is open
					isLeftPanelOpen = true;
				}
			}
		}

		// Initial check
		updateResponsiveState();

		// Listen for window resize
		if (browser) {
			window.addEventListener('resize', updateResponsiveState);
		}

		// Load collapse states from localStorage
		if (browser) {
			const savedAlgorithmState = localStorage.getItem('algorithmSectionCollapsed');
			const savedParameterState = localStorage.getItem('parameterSectionCollapsed');
			isAlgorithmSectionOpen = savedAlgorithmState !== 'true';
			isParameterSectionOpen = savedParameterState !== 'true';
		}

		// Check if user has seen welcome modal before
		if (browser) {
			const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
			// Only show modal if user hasn't seen it before
			if (hasSeenWelcome === 'true') {
				showWelcomeModal = false;
			}
		}
	});

	// Save collapse states to localStorage
	$effect(() => {
		if (browser) {
			localStorage.setItem('algorithmSectionCollapsed', (!isAlgorithmSectionOpen).toString());
			localStorage.setItem('parameterSectionCollapsed', (!isParameterSectionOpen).toString());
		}
	});

	function handleWelcomeClose() {
		showWelcomeModal = false;
		if (browser) {
			localStorage.setItem('hasSeenWelcome', 'true');
		}
	}

	function nextIntroStep() {
		if (currentIntroStep < introSteps.length - 1) {
			currentIntroStep++;
		} else {
			handleWelcomeClose();
		}
	}

	function prevIntroStep() {
		if (currentIntroStep > 0) {
			currentIntroStep--;
		}
	}

	function skipIntro() {
		handleWelcomeClose();
	}

	function handleModalBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleWelcomeClose();
		}
	}

	function toggleHints() {
		showHints = !showHints;
	}

	// Initialize Fuse.js for fuzzy search
	function initializeFuse() {
		if ($algorithms.length === 0) return;
		
		const options = {
			keys: [
				{ name: 'name', weight: 0.7 },
				{ name: 'type', weight: 0.2 },
				{ name: 'description', weight: 0.1 }
			],
			threshold: 0.3, // Lower = more strict matching
			includeScore: true,
			includeMatches: true
		};
		
		fuse = new Fuse($algorithms, options);
	}

	// Filtered algorithms based on search query using Fuse.js
	function getFilteredAlgorithms() {
		if (!searchQuery.trim()) {
			return $algorithms;
		}
		
		if (!fuse) {
			initializeFuse();
		}
		
		if (!fuse) {
			return $algorithms;
		}
		
		const results = fuse.search(searchQuery);
		return results.map(result => result.item);
	}

	function clearSearch() {
		searchQuery = '';
	}


</script>

<!-- Welcome Modal -->
{#if showWelcomeModal}
	<div 
		class="intro-modal-backdrop" 
		onclick={handleModalBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && handleWelcomeClose()}
		role="button"
		tabindex="0"
		aria-label="Click outside to close modal"
	>
		<div class="intro-modal">
			<!-- Progress Bar -->
			<div class="intro-progress">
				<div class="intro-progress-bar">
					<div class="intro-progress-fill" style="width: {((currentIntroStep + 1) / introSteps.length) * 100}%"></div>
				</div>
				<div class="intro-progress-text">
					Step {currentIntroStep + 1} of {introSteps.length}
				</div>
			</div>

			<!-- Content -->
			<div class="intro-content">
				<div class="intro-icon">{introSteps[currentIntroStep].icon}</div>
				<h2 class="intro-title">{introSteps[currentIntroStep].title}</h2>
				<p class="intro-description">{introSteps[currentIntroStep].description}</p>
			</div>

			<!-- Navigation -->
			<div class="intro-navigation">
			<button 
					class="intro-btn intro-btn-secondary" 
					onclick={prevIntroStep}
					disabled={currentIntroStep === 0}
				>
					Previous
				</button>
				<button 
					class="intro-btn intro-btn-skip" 
					onclick={skipIntro}
				>
					Skip
				</button>
			<button 
					class="intro-btn intro-btn-primary" 
					onclick={nextIntroStep}
			>
					{currentIntroStep === introSteps.length - 1 ? 'Get Started' : 'Next'}
			</button>
			</div>
		</div>
	</div>
{/if}

<!-- Hint Notifications -->
{#if showHints}
	<div class="fixed top-4 right-4 z-[10000] animate-in slide-in-from-right-4 fade-in-0 duration-500 ease-out">
		<div 
			class="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 max-w-sm shadow-lg cursor-pointer"
			onclick={toggleHints}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					toggleHints();
				}
			}}
			role="button"
			tabindex="0"
			aria-label="Click to dismiss hint"
		>
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
								onclick={(e) => {
									e.stopPropagation();
									toggleHints();
								}}
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

<!-- Header -->
<Header 
	{isLeftPanelOpen} 
	onToggleLeftPanel={() => {
		isLeftPanelOpen = !isLeftPanelOpen;
		console.log('Main page: Left panel toggled to:', isLeftPanelOpen);
	}} 
/>

<div class="main-container">
	<!-- Mobile Hover Zone -->
	{#if isMobile || isTablet}
		<div 
			class="mobile-hover-zone"
			role="button"
			tabindex="0"
			aria-label="Hover zone to open left panel"
			onmouseenter={() => {
				if (isMobile || isTablet) {
					isLeftPanelOpen = true;
				}
			}}
			onmouseleave={() => {
				if (isMobile || isTablet) {
					isLeftPanelOpen = false;
				}
			}}
		></div>
	{/if}

	<!-- Mobile Backdrop -->
	{#if isMobile && isLeftPanelOpen}
		<div 
			class="mobile-backdrop"
			onclick={() => {
				isLeftPanelOpen = false;
			}}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					isLeftPanelOpen = false;
				}
			}}
			role="button"
			tabindex="0"
			aria-label="Close left panel"
		></div>
	{/if}

	<!-- Left Panel - Algorithm Selection and Parameters -->
	<div 
		class="left-panel" 
		class:collapsed={!isLeftPanelOpen}
		role="button"
		tabindex="0"
		aria-label="Left panel with algorithm selection and parameters"
		onclick={(e) => {
			// Prevent closing when clicking inside the panel content
			e.stopPropagation();
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
			}
		}}
	>
		<div class="panel-content">
			<!-- Algorithm Selection Section -->
			<div class="collapsible-section">
				<button 
					class="section-header" 
					onclick={() => isAlgorithmSectionOpen = !isAlgorithmSectionOpen}
					onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? (e.preventDefault(), isAlgorithmSectionOpen = !isAlgorithmSectionOpen) : null}
					aria-expanded={isAlgorithmSectionOpen}
					aria-controls="algorithm-section-content"
				>
					<h2 class="section-title">Algorithm Selection</h2>
					<svg 
						class="collapse-icon" 
						class:rotated={isAlgorithmSectionOpen}
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				<div 
					class="section-content" 
					class:expanded={isAlgorithmSectionOpen}
					id="algorithm-section-content"
				>
					<!-- Search Bar -->
					<div class="search-section">
						<div class="search-container">
							<div class="search-input-wrapper">
								<svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								<input 
									type="text" 
									placeholder="Search algorithms..." 
									bind:value={searchQuery}
									class="search-input"
								/>
								{#if searchQuery}
									<button 
										onclick={clearSearch}
										class="clear-button"
										title="Clear search"
										aria-label="Clear search"
									>
										<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								{/if}
							</div>
						</div>
					</div>

					<!-- Algorithm Selection List -->
					<div class="algorithm-list">
						{#each getFilteredAlgorithms() as algorithm (algorithm.id)}
							<button 
								class="algorithm-item" 
								class:selected={$selectedAlgorithm?.id === algorithm.id}
								onclick={() => selectAlgorithm(algorithm)}
							>
								<div class="algorithm-info">
									<div class="algorithm-header">
										<h3 class="algorithm-name">{algorithm.name}</h3>
										<span class="algorithm-type" class:type-sorting={algorithm.type === 'sorting'} class:type-search={algorithm.type === 'search'} class:type-graph={algorithm.type === 'graph'}>
											{algorithm.type}
										</span>
									</div>
									<p class="algorithm-description-text">{algorithm.description}</p>
									<div class="algorithm-complexity">
										<span class="complexity-item">
											<strong>Time:</strong> {algorithm.time_complexity}
										</span>
										<span class="complexity-item">
											<strong>Space:</strong> {algorithm.space_complexity}
										</span>
									</div>
								</div>
							</button>
						{/each}
					</div>

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
				</div>
			</div>

			<!-- Parameter Widgets Section -->
			<div class="collapsible-section">
				<button 
					class="section-header" 
					onclick={() => isParameterSectionOpen = !isParameterSectionOpen}
					onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? (e.preventDefault(), isParameterSectionOpen = !isParameterSectionOpen) : null}
					aria-expanded={isParameterSectionOpen}
					aria-controls="parameter-section-content"
				>
					<h2 class="section-title">Parameters</h2>
					<svg 
						class="collapse-icon" 
						class:rotated={isParameterSectionOpen}
						fill="none" 
						stroke="currentColor" 
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				<div 
					class="section-content" 
					class:expanded={isParameterSectionOpen}
					id="parameter-section-content"
				>
					<ParameterWidgets />
			</div>
			</div>

		</div>
	</div>

	<!-- Right Panel - Visualization Area -->
	<div class="right-panel">
		<div class="visualization-container">
			<!-- Grid Visualizer -->
			<GridAlgorithmVisualizer />

		</div>
	</div>
</div>

<NotificationContainer />

<style>
	/* Brilliant Design System Variables */
	:global(:root) {
		/* Light theme (Brilliant-inspired) */
		--bg-primary: #ffffff;
		--bg-secondary: #f8fafc;
		--bg-tertiary: #f1f5f9;
		--bg-quaternary: #e2e8f0;
		--text-primary: #1e293b;
		--text-secondary: #475569;
		--text-tertiary: #64748b;
		--text-quaternary: #94a3b8;
		--border-primary: #e2e8f0;
		--border-secondary: #cbd5e1;
		--border-tertiary: #94a3b8;
		--accent-primary: #2563eb;
		--accent-secondary: #1d4ed8;
		--accent-tertiary: #3b82f6;
		--accent-light: #dbeafe;
		--accent-lighter: #eff6ff;
		--success: #10b981;
		--success-light: #d1fae5;
		--warning: #f59e0b;
		--warning-light: #fef3c7;
		--error: #ef4444;
		--error-light: #fee2e2;
		--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		--radius-sm: 0.375rem;
		--radius-md: 0.5rem;
		--radius-lg: 0.75rem;
		--radius-xl: 1rem;
		--radius-2xl: 1.5rem;
		--transition-fast: 150ms ease-in-out;
		--transition-normal: 200ms ease-in-out;
		--transition-slow: 300ms ease-in-out;
	}

	:global([data-theme="light"]) {
		--bg-primary: #ffffff;
		--bg-secondary: #f8fafc;
		--bg-tertiary: #f1f5f9;
		--bg-quaternary: #e2e8f0;
		--text-primary: #1e293b;
		--text-secondary: #475569;
		--text-tertiary: #64748b;
		--text-quaternary: #94a3b8;
		--border-primary: #e2e8f0;
		--border-secondary: #cbd5e1;
		--border-tertiary: #94a3b8;
		--accent-primary: #2563eb;
		--accent-secondary: #1d4ed8;
		--accent-tertiary: #3b82f6;
		--accent-light: #dbeafe;
		--accent-lighter: #eff6ff;
		--success: #10b981;
		--success-light: #d1fae5;
		--warning: #f59e0b;
		--warning-light: #fef3c7;
		--error: #ef4444;
		--error-light: #fee2e2;
		--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
	}

	:global([data-theme="dark"]) {
		--bg-primary: #0f172a;
		--bg-secondary: #1e293b;
		--bg-tertiary: #334155;
		--bg-quaternary: #475569;
		--text-primary: #f8fafc;
		--text-secondary: #cbd5e1;
		--text-tertiary: #94a3b8;
		--text-quaternary: #64748b;
		--border-primary: #334155;
		--border-secondary: #475569;
		--border-tertiary: #64748b;
		--accent-primary: #3b82f6;
		--accent-secondary: #2563eb;
		--accent-tertiary: #1d4ed8;
		--accent-light: #1e3a8a;
		--accent-lighter: #1e40af;
		--success: #10b981;
		--success-light: #064e3b;
		--warning: #f59e0b;
		--warning-light: #78350f;
		--error: #ef4444;
		--error-light: #7f1d1d;
		--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
		--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
		--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
		--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
		--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
	}

	.main-container {
		display: flex;
		height: calc(100vh - 80px); /* Account for header height */
		background: var(--bg-secondary);
		color: var(--text-primary);
		transition: all var(--transition-slow);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
		overflow: hidden;
	}

	.left-panel {
		width: 400px;
		background: var(--bg-primary);
		border-right: 1px solid var(--border-primary);
		overflow-y: auto;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		z-index: 10;
		box-shadow: var(--shadow-sm);
		transform: translateX(0);
	}

	.left-panel.collapsed {
		width: 0;
		overflow: hidden;
		border-right: none;
		box-shadow: none;
		transform: translateX(-100%);
	}

	.right-panel {
		flex: 1;
		background: var(--bg-secondary);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: background-color 0.3s ease;
		min-width: 0;
	}

	.panel-content {
		padding: 1.5rem;
	}

	.algorithm-description {
		background: var(--bg-primary);
		border: 1px solid var(--border-primary);
		border-radius: 4px;
		padding: 2rem;
		margin-bottom: 2rem;
		transition: all var(--transition-slow);
		box-shadow: var(--shadow-sm);
		position: relative;
		overflow: hidden;
	}

	.algorithm-description::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}

	.algorithm-description:hover::before {
		opacity: 1;
	}

	.algorithm-description:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--border-secondary);
		transform: translateY(-1px);
	}

	.description-title {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--text-primary);
		margin: 0 0 1rem 0;
		transition: color var(--transition-normal);
		letter-spacing: -0.025em;
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.description-text {
		font-size: 0.875rem;
		color: var(--text-secondary);
		line-height: 1.7;
		margin: 0 0 1.5rem 0;
		transition: color var(--transition-normal);
	}

	.complexity-info {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.complexity-item {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		transition: color var(--transition-normal);
		background: var(--bg-tertiary);
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		border: 1px solid var(--border-primary);
		font-weight: 500;
	}

	.complexity-item strong {
		color: var(--text-primary);
		transition: color var(--transition-normal);
		font-weight: 700;
	}


	.right-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		background: var(--bg-secondary);
	}

	.visualization-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
	}


	/* Dark mode styles */

	/* Collapsible Section Styles */
	.collapsible-section {
		margin-bottom: 1.5rem;
		border: 1px solid var(--border-primary);
		border-radius: 4px;
		overflow: hidden;
		background: var(--bg-primary);
		transition: all var(--transition-slow);
		box-shadow: var(--shadow-sm);
	}

	.collapsible-section:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--border-secondary);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem;
		background: var(--bg-tertiary);
		border: none;
		border-bottom: 1px solid var(--border-primary);
		cursor: pointer;
		transition: all var(--transition-normal);
		width: 100%;
		text-align: left;
		position: relative;
	}

	.section-header:hover {
		background: var(--bg-quaternary);
	}

	.section-header:focus {
		outline: 2px solid var(--accent-primary);
		outline-offset: -2px;
		background: var(--accent-lighter);
	}

	.section-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		transition: color var(--transition-normal);
		letter-spacing: -0.025em;
	}

	.collapse-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: var(--text-secondary);
		transition: all var(--transition-normal);
		flex-shrink: 0;
	}

	.collapse-icon.rotated {
		transform: rotate(180deg);
	}

	.section-content {
		padding: 0 1.5rem;
		background: var(--bg-primary);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		max-height: 0;
		opacity: 0;
		transform: translateY(-10px);
	}

	.section-content.expanded {
		padding: 1.5rem;
		max-height: 1000px;
		opacity: 1;
		transform: translateY(0);
	}

	/* Search Section Styles */
	.search-section {
		margin-bottom: 1.5rem;
		animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.search-container {
		position: relative;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background: var(--bg-tertiary);
		border: 1px solid var(--border-primary);
		border-radius: 8px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
	}

	.search-input-wrapper:hover {
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.search-input-wrapper:focus-within {
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
		transform: translateY(-1px);
	}

	.search-icon {
		position: absolute;
		left: 12px;
		width: 18px;
		height: 18px;
		color: var(--text-tertiary);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1;
	}

	.search-input {
		width: 100%;
		padding: 12px 12px 12px 42px;
		border: none;
		background: transparent;
		color: var(--text-primary);
		font-size: 0.875rem;
		font-weight: 500;
		outline: none;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.search-input::placeholder {
		color: var(--text-tertiary);
		transition: color 0.3s ease;
	}

	.search-input:focus::placeholder {
		color: var(--text-secondary);
	}

	.clear-button {
		position: absolute;
		right: 8px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-secondary);
		border: 1px solid var(--border-primary);
		border-radius: 6px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1;
	}

	.clear-button:hover {
		background: var(--accent-primary);
		color: white;
		border-color: var(--accent-primary);
		transform: scale(1.05);
	}

	.clear-button:active {
		transform: scale(0.95);
	}

	.clear-button svg {
		width: 16px;
		height: 16px;
	}

	.algorithm-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.algorithm-item {
		width: 100%;
		padding: 1rem;
		background: var(--bg-tertiary);
		border: 1px solid var(--border-primary);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		text-align: left;
		box-shadow: var(--shadow-xs);
		animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center;
		opacity: 1;
		transform: scale(1) translateY(0);
	}

	.algorithm-item:hover {
		background: var(--bg-quaternary);
		border-color: var(--border-secondary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.algorithm-item.selected {
		background: var(--accent-lighter);
		border-color: var(--accent-primary);
		box-shadow: var(--shadow-md);
	}

	.algorithm-item.selected:hover {
		background: var(--accent-lighter);
		border-color: var(--accent-secondary);
	}

	.algorithm-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.algorithm-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
	}

	.algorithm-name {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
		letter-spacing: -0.025em;
		transition: color var(--transition-normal);
	}

	.algorithm-type {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: all var(--transition-normal);
	}

	.algorithm-type.type-sorting {
		background: var(--accent-lighter);
		color: var(--accent-primary);
	}

	.algorithm-type.type-search {
		background: var(--success-light);
		color: var(--success);
	}

	.algorithm-type.type-graph {
		background: var(--warning-light);
		color: var(--warning);
	}

	.algorithm-description-text {
		font-size: 0.75rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
		transition: color var(--transition-normal);
	}

	.algorithm-complexity {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.algorithm-complexity .complexity-item {
		font-size: 0.6875rem;
		color: var(--text-tertiary);
		background: var(--bg-primary);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid var(--border-primary);
		font-weight: 500;
		transition: all var(--transition-normal);
	}

	.algorithm-complexity .complexity-item strong {
		color: var(--text-primary);
		font-weight: 700;
	}

	/* Intro Modal Styles */
	.intro-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(4px);
		animation: fadeIn 0.4s ease-out;
	}

	.intro-modal {
		background: var(--bg-primary);
		border: 1px solid var(--border-primary);
		box-shadow: var(--shadow-2xl);
		max-width: 500px;
		width: 90%;
		max-height: 80vh;
		overflow: hidden;
		animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		position: relative;
	}

	.intro-progress {
		padding: 1.5rem 2rem 1rem;
		background: var(--bg-tertiary);
		border-bottom: 1px solid var(--border-primary);
	}

	.intro-progress-bar {
		width: 100%;
		height: 8px;
		background: var(--bg-quaternary);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}

	.intro-progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
		transition: width 0.3s ease-out;
		border-radius: 4px;
	}

	.intro-progress-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-align: center;
		letter-spacing: 0.025em;
	}

	.intro-content {
		padding: 2rem;
		text-align: center;
	}

	.intro-icon {
		font-size: 3rem;
		margin-bottom: 1.5rem;
		animation: bounceIn 0.6s ease-out;
	}

	.intro-title {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--text-primary);
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, var(--text-primary), var(--accent-primary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.025em;
	}

	.intro-description {
		font-size: 1rem;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0 0 2rem 0;
		max-width: 400px;
		margin-left: auto;
		margin-right: auto;
	}

	.intro-navigation {
		display: flex;
		gap: 0.75rem;
		padding: 1.5rem 2rem 2rem;
		background: var(--bg-tertiary);
		border-top: 1px solid var(--border-primary);
		justify-content: space-between;
		align-items: center;
	}

	.intro-btn {
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		font-size: 0.875rem;
		border: none;
		cursor: pointer;
		transition: all var(--transition-normal);
		letter-spacing: 0.025em;
		border-radius: 4px;
		position: relative;
		overflow: hidden;
	}

	.intro-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
	}

	.intro-btn-primary {
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		color: white;
		box-shadow: var(--shadow-md);
	}

	.intro-btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.intro-btn-secondary {
		background: var(--bg-primary);
		color: var(--text-primary);
		border: 1px solid var(--border-primary);
		box-shadow: var(--shadow-xs);
	}

	.intro-btn-secondary:hover:not(:disabled) {
		background: var(--bg-quaternary);
		border-color: var(--border-secondary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.intro-btn-skip {
		background: transparent;
		color: var(--text-tertiary);
		text-decoration: underline;
		padding: 0.75rem 1rem;
	}

	.intro-btn-skip:hover {
		color: var(--text-secondary);
		text-decoration: none;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideIn {
		from { 
			opacity: 0;
			transform: translateY(-30px) scale(0.9);
		}
		to { 
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes bounceIn {
		0% { transform: scale(0.3); opacity: 0; }
		50% { transform: scale(1.1); }
		70% { transform: scale(0.9); }
		100% { transform: scale(1); opacity: 1; }
	}


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

	/* Dark mode styles for collapsible sections */

	/* Responsive Breakpoints */
	@media (max-width: 1024px) {
		.left-panel {
			width: 350px;
		}
	}

	@media (max-width: 768px) {
		.main-container {
			flex-direction: row;
			height: 100vh;
		position: relative;
	}

		.left-panel {
			width: 320px;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1000;
			background: var(--bg-primary);
			border-right: 1px solid var(--border-primary);
			box-shadow: var(--shadow-2xl);
			overflow-y: auto;
			transform: translateX(-100%);
			transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}

		.left-panel:not(.collapsed) {
			transform: translateX(0);
		}

		.left-panel.collapsed {
			transform: translateX(-100%);
		}

		.right-panel {
			width: 100%;
			height: 100vh;
			position: relative;
			z-index: 1;
		}

			/* Mobile hover zone */
	.mobile-hover-zone {
		position: fixed;
		top: 0;
		left: 0;
		width: 5%;
		height: 100vh;
		z-index: 1001;
		background: transparent;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.mobile-hover-zone:hover {
		background: rgba(0, 0, 0, 0.1);
	}

	/* Mobile backdrop */
	.mobile-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		cursor: pointer;
		transition: opacity 0.3s ease;
	}

		.panel-content {
			padding: 1rem;
		}

		.algorithm-description {
			padding: 0.75rem;
		}

		.description-title {
			font-size: 1rem;
		}

		.description-text {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.panel-content {
			padding: 0.75rem;
		}

		.algorithm-description {
			padding: 0.5rem;
		}

		.complexity-info {
			flex-direction: column;
			gap: 0.5rem;
		}
	}

</style>
