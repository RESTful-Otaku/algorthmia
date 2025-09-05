<script lang="ts">
	import { onMount } from 'svelte';
	import { error } from '$lib/stores/app';
	import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-svelte';

	interface Props {
		type?: 'error' | 'success' | 'warning' | 'info';
		title?: string;
		message?: string;
		duration?: number;
		dismissible?: boolean;
		onDismiss?: () => void;
	}

	let { 
		type = 'error',
		title = '',
		message = '',
		duration = 10000,
		dismissible = true,
		onDismiss
	}: Props = $props();

	let visible = $state(false);
	let progress = $state(100);
	let progressInterval: ReturnType<typeof setInterval> | null = null;

	// Auto-dismiss timer
	onMount(() => {
		visible = true;
		
		if (duration > 0) {
			progressInterval = setInterval(() => {
				progress -= 100 / (duration / 100);
				if (progress <= 0) {
					dismiss();
				}
			}, 100);
		}

		return () => {
			if (progressInterval) {
				clearInterval(progressInterval);
			}
		};
	});

	function dismiss() {
		visible = false;
		setTimeout(() => {
			if (onDismiss) {
				onDismiss();
			} else {
				error.set(null);
			}
		}, 300); // Wait for animation to complete
	}

	function getIcon() {
		switch (type) {
			case 'error':
				return AlertCircle;
			case 'success':
				return CheckCircle;
			case 'warning':
				return AlertTriangle;
			case 'info':
			default:
				return Info;
		}
	}

	function getTypeClasses() {
		switch (type) {
			case 'error':
				return 'error-notification';
			case 'success':
				return 'success-notification';
			case 'warning':
				return 'warning-notification';
			case 'info':
			default:
				return 'info-notification';
		}
	}

	function getProgressClasses() {
		switch (type) {
			case 'error':
				return 'error-progress';
			case 'success':
				return 'success-progress';
			case 'warning':
				return 'warning-progress';
			case 'info':
			default:
				return 'info-progress';
		}
	}

	const IconComponent = getIcon();
</script>

{#if visible}
	<div 
		class="notification-toast {getTypeClasses()} {visible ? 'visible' : 'hidden'}"
		role="button"
		aria-live="polite"
		onclick={dismiss}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				dismiss();
			}
		}}
		tabindex="0"
		aria-label="Click to dismiss notification"
	>
		<div class="notification-content">
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<IconComponent class="h-5 w-5" />
				</div>
				<div class="ml-3 w-0 flex-1">
					{#if title}
						<p class="text-sm font-medium">{title}</p>
					{/if}
					{#if message}
						<p class="mt-1 text-sm opacity-90">{message}</p>
					{/if}
				</div>
				{#if dismissible}
					<div class="ml-4 flex-shrink-0 flex">
						<button
							type="button"
							class="dismiss-button"
							onclick={(e) => {
								e.stopPropagation();
								dismiss();
							}}
							aria-label="Dismiss notification"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				{/if}
			</div>
		</div>
		
		{#if duration > 0}
			<div class="progress-container">
				<div 
					class="progress-bar {getProgressClasses()}"
					style="width: {progress}%"
				></div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.notification-toast {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 10001;
		max-width: 24rem;
		width: 100%;
		border-radius: 0.5rem;
		box-shadow: var(--shadow-lg);
		border-left: 4px solid;
		transform: translateX(0);
		opacity: 1;
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.notification-toast.hidden {
		transform: translateX(100%);
		opacity: 0;
	}

	/* Notification type styles */
	.error-notification {
		background: var(--bg-primary);
		border-left-color: var(--error);
		color: var(--text-primary);
	}

	.success-notification {
		background: var(--bg-primary);
		border-left-color: var(--success);
		color: var(--text-primary);
	}

	.warning-notification {
		background: var(--bg-primary);
		border-left-color: var(--warning);
		color: var(--text-primary);
	}

	.info-notification {
		background: var(--bg-primary);
		border-left-color: var(--info);
		color: var(--text-primary);
	}

	.dismiss-button {
		display: inline-flex;
		color: var(--text-tertiary);
		transition: color 0.2s ease;
		border-radius: 0.375rem;
		padding: 0.25rem;
	}

	.dismiss-button:hover {
		color: var(--text-secondary);
	}

	.dismiss-button:focus {
		outline: 2px solid var(--accent-primary);
		outline-offset: 2px;
	}

	.progress-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		background: var(--bg-tertiary);
		border-radius: 0.5rem;
		overflow: hidden;
		z-index: 0;
	}

	.progress-bar {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		transition: width 0.05s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0.3;
		z-index: 1;
	}

	.error-progress {
		background: var(--error);
	}

	.success-progress {
		background: var(--success);
	}

	.warning-progress {
		background: var(--warning);
	}

	.info-progress {
		background: var(--info);
	}

	.notification-content {
		position: relative;
		z-index: 2;
		padding: 1rem;
	}

	@keyframes slideInRight {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>
