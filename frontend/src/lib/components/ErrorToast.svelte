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
		duration = 5000,
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
				return 'bg-red-50 border-red-200 text-red-800';
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'info':
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800';
		}
	}

	function getProgressClasses() {
		switch (type) {
			case 'error':
				return 'bg-red-500';
			case 'success':
				return 'bg-green-500';
			case 'warning':
				return 'bg-yellow-500';
			case 'info':
			default:
				return 'bg-blue-500';
		}
	}

	const IconComponent = getIcon();
</script>

{#if visible}
	<div 
		class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 {getTypeClasses()} transform transition-all duration-300 ease-in-out {visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}"
		role="alert"
		aria-live="polite"
	>
		<div class="p-4">
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
							class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
							onclick={dismiss}
							aria-label="Dismiss notification"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				{/if}
			</div>
		</div>
		
		{#if duration > 0}
			<div class="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
				<div 
					class="h-full {getProgressClasses()} transition-all duration-100 ease-linear"
					style="width: {progress}%"
				></div>
			</div>
		{/if}
	</div>
{/if}
