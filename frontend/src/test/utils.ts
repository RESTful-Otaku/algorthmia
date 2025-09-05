// Common test utilities and helpers

import { vi } from 'vitest';

// Mock fetch with common response patterns
export const mockFetch = vi.fn();

// Helper methods for common response patterns
export const mockFetchHelpers = {
	success: (data: any, status = 200) => ({
		ok: true,
		status,
		json: () => Promise.resolve(data),
		text: () => Promise.resolve(JSON.stringify(data))
	}),

	error: (message: string, status = 500) => ({
		ok: false,
		status,
		statusText: message,
		json: () => Promise.resolve({ success: false, error: message })
	}),

	networkError: () => Promise.reject(new Error('Network error'))
};

// Mock localStorage
export const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

// Mock sessionStorage
export const mockSessionStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

// Mock window.location
export const mockLocation = {
	href: 'http://localhost:5173',
	origin: 'http://localhost:5173',
	pathname: '/',
	search: '',
	hash: ''
};

// Mock performance API
export const mockPerformance = {
	now: vi.fn(() => Date.now()),
	mark: vi.fn(),
	measure: vi.fn(),
	clearMarks: vi.fn(),
	clearMeasures: vi.fn()
};

// Mock IntersectionObserver
export const mockIntersectionObserver = {
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
};

// Test data generators
export const testData = {
	// Generate random array for algorithm testing
	randomArray: (size: number, min = 1, max = 100) => {
		return Array.from({ length: size }, () => 
			Math.floor(Math.random() * (max - min + 1)) + min
		);
	},

	// Generate sorted array
	sortedArray: (size: number, start = 1) => {
		return Array.from({ length: size }, (_, i) => start + i);
	},

	// Generate reverse sorted array
	reverseSortedArray: (size: number, start = 100) => {
		return Array.from({ length: size }, (_, i) => start - i);
	},

	// Generate algorithm metadata
	algorithmMetadata: (id: string, name: string) => ({
		id,
		name,
		type: 'sorting',
		description: `Test ${name} algorithm`,
		timeComplexity: 'O(n²)',
		spaceComplexity: 'O(1)',
		category: 'Comparison Sort',
		enabled: true
	}),

	// Generate algorithm step
	algorithmStep: (stepNumber: number, description: string, array: number[]) => ({
		stepNumber,
		description,
		array: [...array],
		highlights: [],
		metadata: {},
		timestamp: new Date()
	})
};

// Common test assertions
export const assertions = {
	// Check if array is sorted
	isSorted: (arr: number[]) => {
		for (let i = 1; i < arr.length; i++) {
			if (arr[i] < arr[i - 1]) return false;
		}
		return true;
	},

	// Check if two arrays have same elements (order doesn't matter)
	hasSameElements: (arr1: number[], arr2: number[]) => {
		if (arr1.length !== arr2.length) return false;
		const sorted1 = [...arr1].sort((a, b) => a - b);
		const sorted2 = [...arr2].sort((a, b) => a - b);
		return sorted1.every((val, i) => val === sorted2[i]);
	},

	// Check if array contains only valid numbers
	isValidNumberArray: (arr: any[]) => {
		return Array.isArray(arr) && arr.every(item => typeof item === 'number' && !isNaN(item));
	}
};

// Mock component props
export const mockProps = {
	button: {
		variant: 'primary',
		size: 'md',
		disabled: false,
		loading: false,
		onClick: vi.fn()
	},

	card: {
		title: 'Test Card',
		subtitle: 'Test subtitle',
		hover: false,
		onClick: vi.fn()
	},

	input: {
		type: 'text',
		placeholder: 'Test input',
		value: '',
		disabled: false,
		required: false,
		onChange: vi.fn()
	}
};

// Setup common mocks
export const setupMocks = () => {
	// Mock global objects
	Object.defineProperty(window, 'localStorage', {
		value: mockLocalStorage,
		writable: true
	});

	Object.defineProperty(window, 'sessionStorage', {
		value: mockSessionStorage,
		writable: true
	});

	Object.defineProperty(window, 'location', {
		value: mockLocation,
		writable: true
	});

	Object.defineProperty(window, 'performance', {
		value: mockPerformance,
		writable: true
	});

	Object.defineProperty(window, 'IntersectionObserver', {
		value: vi.fn(() => mockIntersectionObserver),
		writable: true
	});

	// Mock fetch
	global.fetch = mockFetch;
};

// Cleanup mocks
export const cleanupMocks = () => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
};

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock async function with delay
export const mockAsyncFunction = (result: any, delay = 100) => {
	return vi.fn(() => new Promise(resolve => setTimeout(() => resolve(result), delay)));
};

// Test environment helpers
export const testEnv = {
	isDev: import.meta.env.DEV,
	isProd: import.meta.env.PROD,
	isTest: import.meta.env.MODE === 'test'
};
