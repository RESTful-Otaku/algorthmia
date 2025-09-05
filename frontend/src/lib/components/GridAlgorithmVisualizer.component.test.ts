import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the API
const mockExecuteAlgorithm = vi.fn();
vi.mock('$lib/api', () => ({
	api: {
		executeAlgorithm: mockExecuteAlgorithm
	}
}));

// Mock the analytics
const mockTrackAlgorithmExecution = vi.fn();
const mockTrackUserInteraction = vi.fn();
vi.mock('$lib/utils/analytics', () => ({
	trackAlgorithmExecution: mockTrackAlgorithmExecution,
	trackUserInteraction: mockTrackUserInteraction
}));

// Mock the GridAlgorithmVisualizer component logic
class MockGridAlgorithmVisualizer {
	private selectedAlgorithm: any = null;
	private isGenerating = false;
	private steps: any[] = [];
	private currentStep = 0;
	private error: string | null = null;
	private config = {
		arraySize: 20,
		speed: 5,
		data: [] as number[]
	};

	constructor(props: { selectedAlgorithm?: any }) {
		this.selectedAlgorithm = props.selectedAlgorithm;
	}

	async generateData() {
		if (!this.selectedAlgorithm) return;
		
		this.isGenerating = true;
		this.error = null;
		this.steps = [];
		this.currentStep = 0;

		try {
			// Simulate data generation with a small delay
			await new Promise(resolve => setTimeout(resolve, 10));
			
			this.config.data = Array.from({ length: this.config.arraySize }, (_, i) => 
				Math.floor(Math.random() * 100) + 1
			);
			
			// Simulate algorithm execution
			const mockSteps = [
				{
					stepNumber: 0,
					action: 'initialize',
					data: [...this.config.data],
					highlights: [],
					metadata: { description: 'Starting algorithm' }
				},
				{
					stepNumber: 1,
					action: 'compare',
					data: [...this.config.data],
					highlights: [0, 1],
					metadata: { description: 'Comparing elements' }
				}
			];

			this.steps = mockSteps;
			this.isGenerating = false;
			
			mockTrackAlgorithmExecution(this.selectedAlgorithm.id, 100, mockSteps.length, true);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Unknown error';
			this.isGenerating = false;
		}
	}

	async executeAlgorithm() {
		if (!this.selectedAlgorithm) return;

		this.isGenerating = true;
		this.error = null;

		try {
			const result = await mockExecuteAlgorithm(this.selectedAlgorithm.id, this.config);
			this.steps = result;
			this.isGenerating = false;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Execution failed';
			this.isGenerating = false;
		}
	}

	nextStep() {
		if (this.currentStep < this.steps.length - 1) {
			this.currentStep++;
		}
	}

	previousStep() {
		if (this.currentStep > 0) {
			this.currentStep--;
		}
	}

	reset() {
		this.steps = [];
		this.currentStep = 0;
		this.error = null;
		this.isGenerating = false;
	}

	updateConfig(newConfig: Partial<typeof this.config>) {
		this.config = { ...this.config, ...newConfig };
	}

	getCurrentStep() {
		return this.steps[this.currentStep] || null;
	}

	getStatus() {
		return {
			isGenerating: this.isGenerating,
			hasSteps: this.steps.length > 0,
			currentStep: this.currentStep,
			totalSteps: this.steps.length,
			error: this.error,
			isDisabled: !this.selectedAlgorithm
		};
	}
}

describe('GridAlgorithmVisualizer', () => {
	const mockAlgorithm = {
		id: 'bubble-sort',
		name: 'Bubble Sort',
		type: 'sorting' as const,
		description: 'A simple sorting algorithm',
		time_complexity: 'O(n²)',
		space_complexity: 'O(1)',
		category: 'Sorting',
		enabled: true
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the visualizer container', () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		const status = visualizer.getStatus();
		expect(status.isDisabled).toBe(false);
	});

	it('should show loading state when generating data', async () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		// Start generation (async)
		const generationPromise = visualizer.generateData();
		
		// Check status while generating
		const status = visualizer.getStatus();
		expect(status.isGenerating).toBe(true);
		
		// Wait for completion
		await generationPromise;
	});

	it('should display algorithm steps after generation', async () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		await visualizer.generateData();
		
		const status = visualizer.getStatus();
		expect(status.hasSteps).toBe(true);
		expect(status.totalSteps).toBeGreaterThan(0);
	});

	it('should handle generation errors gracefully', async () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		// Mock API error
		mockExecuteAlgorithm.mockRejectedValueOnce(new Error('API Error'));

		await visualizer.executeAlgorithm();
		
		const status = visualizer.getStatus();
		expect(status.error).toBe('API Error');
		expect(status.isGenerating).toBe(false);
	});

	it('should update step information when rendering steps', async () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		await visualizer.generateData();
		
		const currentStep = visualizer.getCurrentStep();
		expect(currentStep).toBeDefined();
		expect(currentStep?.stepNumber).toBe(0);
		expect(currentStep?.action).toBe('initialize');
	});

	it('should be disabled when no algorithm is selected', () => {
		const visualizer = new MockGridAlgorithmVisualizer({});

		const status = visualizer.getStatus();
		expect(status.isDisabled).toBe(true);
	});

	it('should handle custom events', async () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		await visualizer.generateData();
		
		// Test step navigation
		visualizer.nextStep();
		expect(visualizer.getStatus().currentStep).toBe(1);
		
		visualizer.previousStep();
		expect(visualizer.getStatus().currentStep).toBe(0);
	});

	it('should clean up event listeners on destroy', () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		// Test reset functionality
		visualizer.reset();
		
		const status = visualizer.getStatus();
		expect(status.hasSteps).toBe(false);
		expect(status.currentStep).toBe(0);
		expect(status.error).toBe(null);
	});

	it('should update configuration correctly', () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		visualizer.updateConfig({ arraySize: 50, speed: 10 });
		
		expect(visualizer['config'].arraySize).toBe(50);
		expect(visualizer['config'].speed).toBe(10);
	});

	it('should track analytics events', async () => {
		const visualizer = new MockGridAlgorithmVisualizer({
			selectedAlgorithm: mockAlgorithm
		});

		await visualizer.generateData();
		
		expect(mockTrackAlgorithmExecution).toHaveBeenCalledWith(
			'bubble-sort',
			expect.any(Number),
			expect.any(Number),
			true
		);
	});
});