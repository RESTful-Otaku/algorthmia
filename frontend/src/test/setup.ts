import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Ensure we're in a client-side environment for component tests
if (typeof window === 'undefined') {
	// Mock window for server-side rendering
	Object.defineProperty(global, 'window', {
		value: {},
		writable: true
	});
}

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
	value: {
		randomUUID: vi.fn(() => 'test-uuid-123')
	}
});

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', {
	value: sessionStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb: FrameRequestCallback) => setTimeout(cb, 0) as unknown as number);
global.cancelAnimationFrame = vi.fn((id: number) => clearTimeout(id));

// Mock performance
Object.defineProperty(global, 'performance', {
	value: {
		now: vi.fn(() => Date.now()),
		mark: vi.fn(),
		measure: vi.fn(),
		getEntriesByType: vi.fn(() => []),
		getEntriesByName: vi.fn(() => [])
	}
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

import { beforeEach, afterEach } from 'vitest';

beforeEach(() => {
	// Reset all mocks before each test
	vi.clearAllMocks();
	
	// Reset localStorage mock
	localStorageMock.getItem.mockReturnValue(null);
	localStorageMock.setItem.mockImplementation(() => {});
	localStorageMock.removeItem.mockImplementation(() => {});
	localStorageMock.clear.mockImplementation(() => {});
});

afterEach(() => {
	// Restore console methods
	console.error = originalConsoleError;
	console.warn = originalConsoleWarn;
});
