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
	:global(.error-boundary) {
		padding: 2rem;
		text-align: center;
	}
	
	:global(.error-content) {
		max-width: 28rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	:global(.error-icon) {
		color: #ef4444;
		margin: 0 auto;
	}
	
	:global(.error-title) {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
	}
	
	:global(.dark .error-title) {
		color: #f3f4f6;
	}
	
	:global(.error-message) {
		color: #6b7280;
	}
	
	:global(.dark .error-message) {
		color: #9ca3af;
	}
	
	:global(.error-details) {
		text-align: left;
		background-color: #f3f4f6;
		border-radius: 0.5rem;
		padding: 1rem;
	}
	
	:global(.dark .error-details) {
		background-color: #1f2937;
	}
	
	:global(.error-details summary) {
		cursor: pointer;
		font-weight: 500;
		color: #111827;
	}
	
	:global(.dark .error-details summary) {
		color: #f3f4f6;
	}
	
	:global(.error-stack) {
		font-size: 0.75rem;
		color: #6b7280;
		margin-top: 0.5rem;
		white-space: pre-wrap;
	}
	
	:global(.dark .error-stack) {
		color: #9ca3af;
	}
	
	:global(.error-actions) {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}
</style>
