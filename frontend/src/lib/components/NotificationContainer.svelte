<script lang="ts">
	import { notifications, removeNotification } from '$lib/stores/app';
	import ErrorToast from './ErrorToast.svelte';
	import type { Notification } from '$lib/types';
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each $notifications as notification (notification.id)}
		<ErrorToast
			type={notification.type}
			title={notification.title}
			message={notification.message}
			duration={notification.duration || 5000}
			dismissible={true}
			onDismiss={() => removeNotification(notification.id)}
		/>
	{/each}
</div>