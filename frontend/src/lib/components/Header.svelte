<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Props
	let { isLeftPanelOpen = true, onToggleLeftPanel }: { isLeftPanelOpen?: boolean; onToggleLeftPanel: () => void } = $props();

	let isDark = $state(true);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
		// Load theme from localStorage or default to dark
		if (browser) {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				isDark = savedTheme === 'dark';
			}
			updateTheme();
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		updateTheme();
		if (browser) {
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		}
	}

	function toggleLeftPanel() {
		console.log('Header: Toggling left panel');
		onToggleLeftPanel();
	}

	function updateTheme() {
		if (browser) {
			document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
		}
	}

	// Reactive update when theme changes
	$effect(() => {
		if (mounted) {
			updateTheme();
		}
	});
</script>

<header class="app-header">
	<div class="header-content">
		<div class="left-section">
			<button 
				class="hamburger-logo" 
				class:panel-open={isLeftPanelOpen}
				onclick={toggleLeftPanel}
				aria-label={isLeftPanelOpen ? 'Close left panel' : 'Open left panel'}
				title={isLeftPanelOpen ? 'Close left panel' : 'Open left panel'}
			>
				<img src="/algorthmia.png" alt="Menu" class="hamburger-icon" />
			</button>
			<div class="title-section">
				<h1 class="app-title">Algorthmia</h1>
				<span class="app-version">v1.0.0</span>
			</div>
		</div>

		<div class="right-section">
			<button 
				class="theme-toggle-switch" 
				onclick={toggleTheme}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
			>
				<div class="toggle-track">
					<div class="toggle-thumb" class:active={isDark}>
						{#if isDark}
							<!-- Moon icon -->
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						{:else}
							<!-- Sun icon -->
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
								<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
							</svg>
						{/if}
				</div>
				</div>
			</button>
		</div>
	</div>
</header>

<style>
	.app-header {
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-primary);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		position: sticky;
		top: 0;
		z-index: 100;
		transition: all var(--transition-slow);
		box-shadow: var(--shadow-md);
	}

	.header-content {
		width: 100%;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80px;
	}

	.left-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.hamburger-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border: none;
		background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
		border-radius: 4px;
		cursor: pointer;
		transition: all var(--transition-normal);
		color: white;
		position: relative;
		overflow: hidden;
		box-shadow: var(--shadow-lg);
	}

	.hamburger-logo:hover {
		transform: translateY(-2px) scale(1.05);
		box-shadow: var(--shadow-xl);
	}

	.hamburger-logo:active {
		transform: translateY(0) scale(1);
		box-shadow: var(--shadow-md);
	}

	.hamburger-icon {
		width: 24px;
		height: 24px;
		transition: all var(--transition-normal);
		object-fit: contain;
	}

	.hamburger-logo:hover .hamburger-icon {
		transform: rotate(90deg) scale(1.1);
	}
	
	.hamburger-logo:active .hamburger-icon {
		transform: rotate(90deg) scale(0.95);
	}

	.hamburger-logo.panel-open {
		background: var(--accent-primary);
		box-shadow: var(--shadow-xl);
	}

	.hamburger-logo.panel-open .hamburger-icon {
		transform: rotate(90deg);
	}

	.title-section {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
	}


	.app-title {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text-primary);
		margin: 0;
		letter-spacing: -0.025em;
		transition: color var(--transition-normal);
		background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.app-version {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		font-weight: 600;
		background: var(--bg-tertiary);
		padding: 0.375rem 0.75rem;
		border-radius: 4px;
		width: fit-content;
		transition: all var(--transition-normal);
		border: 1px solid var(--border-primary);
		letter-spacing: 0.025em;
	}

	.right-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}



	/* Light theme variables */
	:global([data-theme="light"]) {
		--header-bg: rgba(255, 255, 255, 0.95);
		--border-color: #e5e7eb;
		--text-primary: #111827;
		--text-secondary: #6b7280;
		--version-bg: #f3f4f6;
		--toggle-bg: #f9fafb;
		--toggle-color: #374151;
		--toggle-hover-bg: #f3f4f6;
		--toggle-shadow: rgba(0, 0, 0, 0.1);
	}

	/* Dark theme variables */
	:global([data-theme="dark"]) {
		--header-bg: rgba(17, 24, 39, 0.95);
		--border-color: #374151;
		--text-primary: #f9fafb;
		--text-secondary: #9ca3af;
		--version-bg: #374151;
		--toggle-bg: #374151;
		--toggle-color: #f9fafb;
		--toggle-hover-bg: #4b5563;
		--toggle-shadow: rgba(0, 0, 0, 0.3);
	}

	/* Default dark theme for SSR */
	:global(:root) {
		--header-bg: rgba(17, 24, 39, 0.95);
		--border-color: #374151;
		--text-primary: #f9fafb;
		--text-secondary: #9ca3af;
		--version-bg: #374151;
		--toggle-bg: #374151;
		--toggle-color: #f9fafb;
		--toggle-hover-bg: #4b5563;
		--toggle-shadow: rgba(0, 0, 0, 0.3);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.header-content {
			padding: 0.75rem 1rem;
		}

		.app-title {
			font-size: 1.25rem;
		}


	}

	.theme-toggle-switch {
		display: flex;
		align-items: center;
		border: none;
		background: none;
		cursor: pointer;
		padding: 0;
		transition: all var(--transition-normal);
	}

	.toggle-track {
		width: 60px;
		height: 32px;
		background: var(--bg-tertiary);
		border-radius: 16px;
		position: relative;
		transition: all var(--transition-normal);
		border: 2px solid var(--border-primary);
		box-shadow: var(--shadow-sm);
	}

	.toggle-track:hover {
		background: var(--bg-quaternary);
		border-color: var(--border-secondary);
		box-shadow: var(--shadow-md);
	}

	.toggle-thumb {
		width: 24px;
		height: 24px;
		background: var(--bg-primary);
		border-radius: 50%;
		position: absolute;
		top: 2px;
		left: 2px;
		transition: all var(--transition-normal);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--border-primary);
	}

	.toggle-thumb.active {
		transform: translateX(28px);
		background: var(--accent-primary);
		border-color: var(--accent-secondary);
	}

	.toggle-thumb svg {
		transition: all var(--transition-normal);
		color: var(--text-secondary);
	}

	.toggle-thumb.active svg {
		color: white;
	}
</style>