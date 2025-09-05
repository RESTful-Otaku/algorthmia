<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Visualizer from '$lib/components/Visualizer.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';
	import NotificationContainer from '$lib/components/NotificationContainer.svelte';
	import { 
		algorithms, 
		selectedAlgorithm, 
		controlState, 
		sidePanelState,
		setAlgorithms,
		setLoading,
		setError,
		addNotification
	} from '$lib/stores/app';
	import { api, APIError } from '$lib/api';

	onMount(async () => {
		try {
			setLoading(true);
			const fetchedAlgorithms = await api.getAlgorithms();
			setAlgorithms(fetchedAlgorithms);
			addNotification({
				type: 'success',
				title: 'Welcome!',
				message: 'Algorithm Visualizer loaded successfully. Select an algorithm to get started.',
				duration: 3000,
			});
		} catch (err) {
			const errorMessage = err instanceof APIError ? err.message : 'Failed to load algorithms';
			setError(errorMessage);
			addNotification({
				type: 'error',
				title: 'Error',
				message: errorMessage,
				duration: 5000,
			});
		} finally {
			setLoading(false);
		}
	});
</script>

<div class="flex h-screen overflow-hidden">
	<!-- Main Content -->
	<div class="flex-1 flex flex-col">
		<!-- Header -->
		<Header />
		
		<!-- Main Visualization Area -->
		<main class="flex-1 flex flex-col p-6 space-y-6">
			<!-- Visualizer -->
			<div class="flex-1 min-h-0">
				<Visualizer />
			</div>
			
			<!-- Control Panel -->
			<ControlPanel />
		</main>
	</div>
	
	<!-- Side Panel -->
	<SidePanel />
</div>

<!-- Notifications -->
<NotificationContainer />
