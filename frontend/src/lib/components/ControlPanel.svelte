<script lang="ts">
	import { 
		selectedAlgorithm, 
		controlState, 
		execution,
		play, 
		pause, 
		stop, 
		setCurrentStep, 
		setSpeed,
		setGenerating,
		addNotification
	} from '$lib/stores/app';
	import { 
		Play, 
		Pause, 
		Square, 
		RotateCcw, 
		Shuffle,
		SkipBack,
		SkipForward,
		Settings
	} from 'lucide-svelte';
	import Button from './ui/Button.svelte';
	import Slider from './ui/Slider.svelte';
	import { api, APIError } from '$lib/api';

	let isExecuting = false;

	// Reactive values
	$: canPlay = $selectedAlgorithm && !$controlState.isPlaying && !isExecuting;
	$: canPause = $controlState.isPlaying && !isExecuting;
	$: canStop = $controlState.isPlaying || $controlState.isPaused || $execution;
	$: canGenerate = $selectedAlgorithm && !isExecuting;

	async function handlePlay() {
		if (!$selectedAlgorithm) return;
		
		if (!$execution) {
			await generateAndExecute();
		} else {
			play();
		}
	}

	async function handlePause() {
		pause();
	}

	function handleStop() {
		stop();
	}

	async function handleGenerate() {
		if (!$selectedAlgorithm) return;
		await generateAndExecute();
	}

	async function handleReset() {
		stop();
		await generateAndExecute();
	}

	async function generateAndExecute() {
		if (!$selectedAlgorithm || isExecuting) return;

		try {
			isExecuting = true;
			setGenerating(true);
			
			const config = {
				array_size: 20,
				speed: $controlState.speed,
			};

			const steps = await api.executeAlgorithm($selectedAlgorithm.id, config);
			
			// Create execution object
			const newExecution = {
				id: crypto.randomUUID(),
				algorithm_id: $selectedAlgorithm.id,
				steps,
				current_step: 0,
				is_running: false,
				is_paused: false,
				is_complete: false,
				start_time: new Date().toISOString(),
			};

			// Update stores
			execution.set(newExecution);
			controlState.update(state => ({
				...state,
				totalSteps: steps.length,
				currentStep: 0,
			}));

			addNotification({
				type: 'success',
				title: 'Algorithm Ready',
				message: `${$selectedAlgorithm.name} generated ${steps.length} steps`,
				duration: 3000,
			});

		} catch (error) {
			const errorMessage = error instanceof APIError ? error.message : 'Failed to execute algorithm';
			addNotification({
				type: 'error',
				title: 'Execution Error',
				message: errorMessage,
				duration: 5000,
			});
		} finally {
			isExecuting = false;
			setGenerating(false);
		}
	}

	function handleStepChange(step: number) {
		setCurrentStep(step);
	}

	function handleSpeedChange(speed: number) {
		setSpeed(speed);
	}

	function handlePrevious() {
		const newStep = Math.max(0, $controlState.currentStep - 1);
		setCurrentStep(newStep);
	}

	function handleNext() {
		const newStep = Math.min($controlState.totalSteps - 1, $controlState.currentStep + 1);
		setCurrentStep(newStep);
	}
</script>

<div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-lg p-6">
	<div class="flex items-center justify-between">
		<!-- Left side - Main controls -->
		<div class="flex items-center space-x-3">
			<!-- Play/Pause/Stop buttons -->
			<Button
				variant="primary"
				size="lg"
				disabled={!canPlay}
				loading={isExecuting}
				onClick={handlePlay}
			>
				{#if isExecuting}
					<svg class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				{:else if $controlState.isPlaying}
					<Pause class="w-5 h-5" />
				{:else}
					<Play class="w-5 h-5" />
				{/if}
				{$controlState.isPlaying ? 'Pause' : 'Play'}
			</Button>

			<Button
				variant="outline"
				size="lg"
				disabled={!canPause}
				onClick={handlePause}
			>
				<Pause class="w-5 h-5" />
			</Button>

			<Button
				variant="outline"
				size="lg"
				disabled={!canStop}
				onClick={handleStop}
			>
				<Square class="w-5 h-5" />
			</Button>

			<!-- Step navigation -->
			<div class="flex items-center space-x-2 ml-4">
				<Button
					variant="ghost"
					size="sm"
					disabled={$controlState.currentStep === 0}
					onClick={handlePrevious}
				>
					<SkipBack class="w-4 h-4" />
				</Button>

				<Button
					variant="ghost"
					size="sm"
					disabled={$controlState.currentStep >= $controlState.totalSteps - 1}
					onClick={handleNext}
				>
					<SkipForward class="w-4 h-4" />
				</Button>
			</div>
		</div>

		<!-- Center - Step scrubber -->
		{#if $execution && $controlState.totalSteps > 0}
			<div class="flex-1 max-w-md mx-6">
				<div class="flex items-center space-x-3">
					<span class="text-sm text-secondary-600 dark:text-secondary-400 font-mono">
						{$controlState.currentStep + 1}
					</span>
					
					<Slider
						min={0}
						max={$controlState.totalSteps - 1}
						value={$controlState.currentStep}
						onChange={handleStepChange}
						class="flex-1"
					/>
					
					<span class="text-sm text-secondary-600 dark:text-secondary-400 font-mono">
						{$controlState.totalSteps}
					</span>
				</div>
			</div>
		{/if}

		<!-- Right side - Additional controls -->
		<div class="flex items-center space-x-3">
			<!-- Speed control -->
			<div class="flex items-center space-x-2">
				<span class="text-sm text-secondary-600 dark:text-secondary-400">Speed:</span>
				<Slider
					min={1}
					max={10}
					value={$controlState.speed}
					onChange={handleSpeedChange}
					class="w-20"
				/>
			</div>

			<!-- Generate button -->
			<Button
				variant="outline"
				size="lg"
				disabled={!canGenerate}
				loading={isExecuting}
				onClick={handleGenerate}
			>
				<Shuffle class="w-5 h-5" />
				Generate
			</Button>

			<!-- Reset button -->
			<Button
				variant="outline"
				size="lg"
				disabled={!$execution || isExecuting}
				onClick={handleReset}
			>
				<RotateCcw class="w-5 h-5" />
				Reset
			</Button>
		</div>
	</div>
</div>
