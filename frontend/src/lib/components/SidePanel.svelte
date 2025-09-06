<script lang="ts">
	import { 
		sidePanelState, 
		selectedAlgorithm, 
		filteredAlgorithms,
		selectAlgorithm,
		setSearchQuery,
		toggleConfig,
		toggleSidePanel
	} from '$lib/stores/app';
	import { 
		Search, 
		X, 
		ChevronDown, 
		ChevronRight,
		Settings,
		Play,
		SortAsc,
		Search as SearchIcon,
		Network
	} from 'lucide-svelte';
	import Button from './ui/Button.svelte';
	import Input from './ui/Input.svelte';
	import Card from './ui/Card.svelte';
	import Collapsible from './ui/Collapsible.svelte';
	import type { Algorithm } from '$lib/types';

	let searchInput = $state('');

	// State for collapsed sections
	let collapsedSections = $state({
		sorting: false,
		search: false,
		graph: false
	} as Record<string, boolean>);

	// Reactive search
	$effect(() => {
		if (searchInput !== $sidePanelState.searchQuery) {
			setSearchQuery(searchInput);
		}
	});

	// Group algorithms by type
	let algorithmsByType = $derived($filteredAlgorithms.reduce((acc, algorithm) => {
		if (!acc[algorithm.type]) {
			acc[algorithm.type] = [];
		}
		acc[algorithm.type].push(algorithm);
		return acc;
	}, {} as Record<string, Algorithm[]>));

	// Get category icon
	function getCategoryIcon(type: string) {
		switch (type) {
			case 'sorting':
				return SortAsc;
			case 'search':
				return SearchIcon;
			case 'graph':
				return Network;
			default:
				return SortAsc;
		}
	}

	// Get category display name
	function getCategoryDisplayName(type: string): string {
		switch (type) {
			case 'sorting':
				return 'Sorting Algorithms';
			case 'search':
				return 'Search Algorithms';
			case 'graph':
				return 'Graph Algorithms';
			default:
				return type.charAt(0).toUpperCase() + type.slice(1);
		}
	}

	// Toggle section collapse
	function toggleSection(type: string) {
		collapsedSections[type] = !collapsedSections[type];
	}

	function handleAlgorithmSelect(algorithm: Algorithm) {
		selectAlgorithm(algorithm);
	}

	function handleSearchChange(value: string | number) {
		searchInput = String(value);
	}

	function clearSearch() {
		searchInput = '';
		setSearchQuery('');
	}

	function getAlgorithmTypeColor(type: string): string {
		switch (type) {
			case 'sorting':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'search':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'graph':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		}
	}
</script>

<!-- Backdrop for mobile -->
{#if $sidePanelState.isOpen}
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
		onclick={toggleSidePanel}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && toggleSidePanel()}
	></div>
{/if}

<!-- Side Panel -->
<aside class="fixed right-0 top-0 h-full w-80 bg-white dark:bg-secondary-800 border-l border-secondary-200 dark:border-secondary-700 shadow-xl z-50 transform transition-transform duration-300 ease-in-out {$sidePanelState.isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:z-auto">
	<div class="flex flex-col h-full">
		<!-- Header -->
		<div class="p-4 border-b border-secondary-200 dark:border-secondary-700">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
					Algorithms
				</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={toggleSidePanel}
					class="lg:hidden"
				>
					<X class="w-5 h-5" />
				</Button>
			</div>
		</div>

		<!-- Search -->
		<div class="p-4 border-b border-secondary-200 dark:border-secondary-700">
			<div class="relative">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
				<Input
					type="text"
					placeholder="Search algorithms..."
					value={searchInput}
					onChange={handleSearchChange}
					class="pl-10 pr-10"
				/>
				{#if searchInput}
					<Button
						variant="ghost"
						size="sm"
						onClick={clearSearch}
						class="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
					>
						<X class="w-4 h-4" />
					</Button>
				{/if}
			</div>
		</div>

		<!-- Algorithm Categories -->
		<div class="flex-1 overflow-y-auto p-4 space-y-3">
			{#each Object.entries(algorithmsByType) as [type, algorithms] (type)}
				{@const IconComponent = getCategoryIcon(type)}
				{@const isCollapsed = collapsedSections[type]}
				
				<div class="category-section">
					<!-- Category Header -->
					<button
						class="category-header"
						onclick={() => toggleSection(type)}
						aria-expanded={!isCollapsed}
					>
						<div class="flex items-center space-x-3">
							<IconComponent class="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
							<h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
								{getCategoryDisplayName(type)}
							</h3>
							<span class="text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded-full">
								{algorithms.length}
							</span>
						</div>
						{#if isCollapsed}
							<ChevronRight class="w-4 h-4 text-secondary-500 dark:text-secondary-400 transition-transform duration-200" />
						{:else}
							<ChevronDown class="w-4 h-4 text-secondary-500 dark:text-secondary-400 transition-transform duration-200" />
						{/if}
					</button>

					<!-- Category Content -->
					{#if !isCollapsed}
						<div class="category-content">
							{#each algorithms as algorithm (algorithm.id)}
								<Card
									class="algorithm-item {$selectedAlgorithm?.id === algorithm.id ? 'selected' : ''}"
									onClick={() => handleAlgorithmSelect(algorithm)}
								>
									<div class="flex items-start justify-between">
										<div class="flex-1 min-w-0">
											<div class="flex items-center space-x-2 mb-1">
												<h4 class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
													{algorithm.name}
												</h4>
											</div>
											<p class="text-xs text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-2">
												{algorithm.description}
											</p>
											<div class="flex items-center space-x-3 text-xs text-secondary-500 dark:text-secondary-400">
												<span>Time: {algorithm.time_complexity}</span>
												<span>Space: {algorithm.space_complexity}</span>
											</div>
										</div>
										{#if $selectedAlgorithm?.id === algorithm.id}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													toggleConfig();
												}}
											>
												<Settings class="w-4 h-4" />
											</Button>
										{/if}
									</div>
								</Card>
							{/each}
						</div>
					{/if}
				</div>
			{/each}

			{#if $filteredAlgorithms.length === 0}
				<div class="text-center py-8">
					<Search class="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
					<p class="text-sm text-secondary-500 dark:text-secondary-400">
						No algorithms found
					</p>
				</div>
			{/if}
		</div>

		<!-- Configuration Panel -->
		{#if $selectedAlgorithm && $sidePanelState.showConfig}
			<div class="border-t border-secondary-200 dark:border-secondary-700 p-4">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-medium text-secondary-900 dark:text-secondary-100">
						Configuration
					</h3>
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleConfig}
					>
						<ChevronDown class="w-4 h-4" />
					</Button>
				</div>
				
				<div class="space-y-4">
					<div>
						<label for="array-size" class="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-2">
							Array Size
						</label>
						<Input
							id="array-size"
							type="number"
							value={20}
							min={5}
							max={100}
							class="w-full"
						/>
					</div>
					
					<div>
						<label for="speed" class="block text-xs font-medium text-secondary-700 dark:text-secondary-300 mb-2">
							Speed
						</label>
						<Input
							id="speed"
							type="number"
							value={5}
							min={1}
							max={10}
							class="w-full"
						/>
					</div>
					
					<Button
						variant="primary"
						size="sm"
						class="w-full"
						onClick={() => {
							// Handle configuration apply
							toggleConfig();
						}}
					>
						<Play class="w-4 h-4 mr-2" />
						Apply & Run
					</Button>
				</div>
			</div>
		{/if}
	</div>
</aside>

<style>
	.category-section {
		border: 1px solid var(--border-primary);
		border-radius: 8px;
		overflow: hidden;
		background: var(--bg-primary);
		transition: all 0.2s ease;
	}

	.category-section:hover {
		border-color: var(--border-secondary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.category-header {
		width: 100%;
		padding: 12px 16px;
		background: var(--bg-tertiary);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: all 0.2s ease;
	}

	.category-header:hover {
		background: var(--bg-quaternary);
	}

	.category-header:focus {
		outline: 2px solid var(--accent-primary);
		outline-offset: -2px;
	}

	.category-content {
		padding: 8px;
		background: var(--bg-primary);
	}

	.algorithm-item {
		margin-bottom: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		border: 1px solid var(--border-primary);
	}

	.algorithm-item:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border-color: var(--border-secondary);
	}

	.algorithm-item.selected {
		background: var(--accent-lighter);
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 2px var(--accent-light);
	}

	.algorithm-item:last-child {
		margin-bottom: 0;
	}

	/* Responsive adjustments */
	@media (max-width: 1024px) {
		.category-header {
			padding: 10px 12px;
		}
		
		.category-content {
			padding: 6px;
		}
	}

	/* Dark mode adjustments */
	:global(.dark) .category-section {
		border-color: var(--border-primary);
	}

	:global(.dark) .category-section:hover {
		border-color: var(--border-secondary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	:global(.dark) .algorithm-item:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
	}
</style>
