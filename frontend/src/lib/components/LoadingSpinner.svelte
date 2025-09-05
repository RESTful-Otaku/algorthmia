<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let color: 'primary' | 'secondary' | 'white' = 'primary';
	export let text: string = '';

	function getSizeClasses() {
		switch (size) {
			case 'sm':
				return 'h-4 w-4';
			case 'lg':
				return 'h-8 w-8';
			case 'md':
			default:
				return 'h-6 w-6';
		}
	}

	function getColorClasses() {
		switch (color) {
			case 'secondary':
				return 'text-gray-500';
			case 'white':
				return 'text-white';
			case 'primary':
			default:
				return 'text-blue-600';
		}
	}
</script>

<div class="flex items-center justify-center {text ? 'space-x-2' : ''}">
	<div 
		class="animate-spin rounded-full border-2 border-gray-300 border-t-current {getSizeClasses()} {getColorClasses()}"
		role="status"
		aria-label="Loading"
	>
		<span class="sr-only">Loading...</span>
	</div>
	{#if text}
		<span class="text-sm font-medium {getColorClasses()}">{text}</span>
	{/if}
</div>
