<script lang="ts">
	import { notifications, removeNotification } from '$lib/stores/app';
	import ErrorToast from './ErrorToast.svelte';
	import type { Notification } from '$lib/types';
</script>

<div class="fixed top-4 right-4 z-[10002] space-y-2 animate-in fade-in-0 duration-300">
	{#each $notifications as notification (notification.id)}
		<ErrorToast
			type={notification.type}
			title={notification.title}
			message={notification.message}
			duration={notification.duration || 10000}
			dismissible={true}
			onDismiss={() => removeNotification(notification.id)}
		/>
	{/each}
</div>