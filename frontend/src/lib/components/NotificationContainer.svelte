<script lang="ts">
	import { notifications, removeNotification } from '$lib/stores/app';
	import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';
	import { slide, fade } from 'svelte/transition';
	import type { NotificationType } from '$lib/types';

	function getNotificationIcon(type: NotificationType) {
		switch (type) {
			case 'success':
				return CheckCircle;
			case 'error':
				return AlertCircle;
			case 'warning':
				return AlertTriangle;
			case 'info':
			default:
				return Info;
		}
	}

	function getNotificationColor(type: NotificationType): string {
		switch (type) {
			case 'success':
				return 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900 dark:border-success-700 dark:text-success-200';
			case 'error':
				return 'bg-error-50 border-error-200 text-error-800 dark:bg-error-900 dark:border-error-700 dark:text-error-200';
			case 'warning':
				return 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900 dark:border-warning-700 dark:text-warning-200';
			case 'info':
			default:
				return 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-200';
		}
	}

	function getIconColor(type: NotificationType): string {
		switch (type) {
			case 'success':
				return 'text-success-600 dark:text-success-400';
			case 'error':
				return 'text-error-600 dark:text-error-400';
			case 'warning':
				return 'text-warning-600 dark:text-warning-400';
			case 'info':
			default:
				return 'text-primary-600 dark:text-primary-400';
		}
	}
</script>

<!-- Notification Container -->
<div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
	{#each $notifications as notification (notification.id)}
		<div
			class="notification-enter p-4 rounded-lg border shadow-lg {getNotificationColor(notification.type)}"
			transition:slide={{ duration: 300 }}
		>
			<div class="flex items-start">
				<div class="flex-shrink-0">
					{#if notification.type === 'success'}
						<CheckCircle class="w-5 h-5 {getIconColor(notification.type)}" />
					{:else if notification.type === 'error'}
						<AlertCircle class="w-5 h-5 {getIconColor(notification.type)}" />
					{:else if notification.type === 'warning'}
						<AlertTriangle class="w-5 h-5 {getIconColor(notification.type)}" />
					{:else}
						<Info class="w-5 h-5 {getIconColor(notification.type)}" />
					{/if}
				</div>
				
				<div class="ml-3 flex-1">
					{#if notification.title}
						<h4 class="text-sm font-medium mb-1">
							{notification.title}
						</h4>
					{/if}
					<p class="text-sm opacity-90">
						{notification.message}
					</p>
					
					{#if notification.duration > 0}
						<div class="mt-2 w-full bg-current bg-opacity-20 rounded-full h-1">
							<div 
								class="loading-bar bg-current bg-opacity-60 h-1 rounded-full"
								style="animation-duration: {notification.duration}ms;"
							></div>
						</div>
					{/if}
				</div>
				
				<div class="ml-4 flex-shrink-0">
					<button
						type="button"
						class="inline-flex text-current opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded"
						onclick={() => removeNotification(notification.id)}
					>
						<X class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>
