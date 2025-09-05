<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './ui/Button.svelte';
	import Card from './ui/Card.svelte';

	interface Props {
		children: any;
		fallback?: any;
		onError?: (error: Error, errorInfo: any) => void;
	}

	let { children, fallback, onError }: Props = $props();

	let hasError = $state(false);
	let error = $state<Error | null>(null);
	let errorInfo = $state<any>(null);

	// Error boundary logic
	$effect(() => {
		try {
			// This will catch errors in the children
			children?.();
		} catch (err) {
			hasError = true;
			error = err instanceof Error ? err : new Error(String(err));
			errorInfo = {
				componentStack: 'Error occurred in component',
				timestamp: new Date().toISOString(),
			};
			
			// Call error handler if provided
			if (onError) {
				onError(error, errorInfo);
			}
			
			// Log error for debugging
			console.error('Error caught by ErrorBoundary:', error, errorInfo);
		}
	});

	function resetError() {
		hasError = false;
		error = null;
		errorInfo = null;
	}

	function reportError() {
		// In a real app, you'd send this to an error reporting service
		console.error('Error reported:', error, errorInfo);
		// You could integrate with services like Sentry, LogRocket, etc.
	}
</script>

{#if hasError}
	<Card class="error-boundary">
		<div class="error-content">
			<div class="error-icon">
				<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/>
					<line x1="15" y1="9" x2="9" y2="15"/>
					<line x1="9" y1="9" x2="15" y2="15"/>
				</svg>
			</div>
			
			<h2 class="error-title">Something went wrong</h2>
			<p class="error-message">
				We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
			</p>
			
			{#if error}
				<details class="error-details">
					<summary>Error Details</summary>
					<pre class="error-stack">{error.message}</pre>
					{#if error.stack}
						<pre class="error-stack">{error.stack}</pre>
					{/if}
				</details>
			{/if}
			
			<div class="error-actions">
				<Button variant="primary" onClick={resetError}>
					Try Again
				</Button>
				<Button variant="secondary" onClick={reportError}>
					Report Error
				</Button>
			</div>
		</div>
	</Card>
{:else}
	{@render children?.()}
{/if}

<style>
	.error-boundary {
		@apply p-8 text-center;
	}
	
	.error-content {
		@apply max-w-md mx-auto space-y-4;
	}
	
	.error-icon {
		@apply text-red-500 mx-auto;
	}
	
	.error-title {
		@apply text-xl font-semibold text-gray-900 dark:text-gray-100;
	}
	
	.error-message {
		@apply text-gray-600 dark:text-gray-400;
	}
	
	.error-details {
		@apply text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4;
	}
	
	.error-details summary {
		@apply cursor-pointer font-medium text-gray-900 dark:text-gray-100;
	}
	
	.error-stack {
		@apply text-xs text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap;
	}
	
	.error-actions {
		@apply flex gap-3 justify-center;
	}
</style>
