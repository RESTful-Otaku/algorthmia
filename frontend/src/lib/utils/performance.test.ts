import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
	debounce, 
	throttle, 
	memoize, 
	createIntersectionObserver,
	calculateVisibleRange,
	optimizeImage,
	getMemoryUsage,
	measurePerformance,
	measureAsyncPerformance
} from './performance';
import { setupMocks, cleanupMocks } from '../../test/utils';

describe('Performance Utilities', () => {
	beforeEach(() => {
		setupMocks();
		// Don't use fake timers to avoid conflicts with performance mock
	});

	afterEach(() => {
		cleanupMocks();
	});

	describe('debounce', () => {
		it('should delay function execution', async () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 10);

			debouncedFn();
			expect(mockFn).not.toHaveBeenCalled();

			await new Promise(resolve => setTimeout(resolve, 15));
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should reset delay on subsequent calls', async () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 10);

			debouncedFn();
			await new Promise(resolve => setTimeout(resolve, 5));
			debouncedFn();
			await new Promise(resolve => setTimeout(resolve, 5));
			expect(mockFn).not.toHaveBeenCalled();

			await new Promise(resolve => setTimeout(resolve, 10));
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should execute immediately when immediate is true', () => {
			const mockFn = vi.fn();
			const debouncedFn = debounce(mockFn, 100, true);

			debouncedFn();
			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});

	describe('throttle', () => {
		it('should limit function execution frequency', async () => {
			const mockFn = vi.fn();
			const throttledFn = throttle(mockFn, 10);

			throttledFn();
			throttledFn();
			throttledFn();

			expect(mockFn).toHaveBeenCalledTimes(1);

			await new Promise(resolve => setTimeout(resolve, 15));
			throttledFn();
			expect(mockFn).toHaveBeenCalledTimes(2);
		});
	});

	describe('memoize', () => {
		it('should cache function results', () => {
			const mockFn = vi.fn((x: number) => x * 2);
			const memoizedFn = memoize(mockFn);

			const result1 = memoizedFn(5);
			const result2 = memoizedFn(5);

			expect(result1).toBe(10);
			expect(result2).toBe(10);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('should use custom key generator', () => {
			const mockFn = vi.fn((a: number, b: number) => a + b);
			const memoizedFn = memoize(mockFn, (a, b) => `${a}-${b}`);

			memoizedFn(1, 2);
			memoizedFn(1, 2);

			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});

	describe('createIntersectionObserver', () => {
		it('should create intersection observer with default options', () => {
			const callback = vi.fn();
			const observer = createIntersectionObserver(callback);

			expect(observer).toBeDefined();
			expect(observer.observe).toBeDefined();
			expect(observer.unobserve).toBeDefined();
			expect(observer.disconnect).toBeDefined();
		});

		it('should create intersection observer with custom options', () => {
			const callback = vi.fn();
			const options = { rootMargin: '10px', threshold: 0.5 };
			const observer = createIntersectionObserver(callback, options);

			expect(observer).toBeDefined();
			expect(observer.observe).toBeDefined();
			expect(observer.unobserve).toBeDefined();
			expect(observer.disconnect).toBeDefined();
		});
	});

	describe('calculateVisibleRange', () => {
		it('should calculate visible range correctly', () => {
			const result = calculateVisibleRange(100, 200, 50, 1000, 5);
			
			expect(result.startIndex).toBeGreaterThanOrEqual(0);
			expect(result.endIndex).toBeLessThanOrEqual(1000);
			expect(result.startIndex).toBeLessThanOrEqual(result.endIndex);
		});

		it('should handle edge cases', () => {
			const result = calculateVisibleRange(0, 100, 50, 10, 0);
			
			expect(result.startIndex).toBe(0);
			expect(result.endIndex).toBeLessThanOrEqual(10);
		});
	});

	describe('optimizeImage', () => {
		it('should add optimization parameters to URL', () => {
			const url = 'https://example.com/image.jpg';
			const optimized = optimizeImage(url, 300, 200, 80);

			expect(optimized).toContain('w=300');
			expect(optimized).toContain('h=200');
			expect(optimized).toContain('q=80');
			expect(optimized).toContain('f=auto');
		});

		it('should handle URLs without optimization', () => {
			const url = 'https://example.com/image.jpg';
			const optimized = optimizeImage(url);

			expect(optimized).toContain('q=80');
			expect(optimized).toContain('f=auto');
		});
	});

	describe('getMemoryUsage', () => {
		it('should return null when memory API is not available', () => {
			// Mock performance.memory as undefined
			const originalMemory = (performance as any).memory;
			delete (performance as any).memory;

			const result = getMemoryUsage();
			expect(result).toBeNull();

			// Restore
			(performance as any).memory = originalMemory;
		});
	});

	describe('measurePerformance', () => {
		it('should measure synchronous function performance', () => {
			const mockFn = vi.fn(() => {
				// Simulate some work
				for (let i = 0; i < 1000; i++) {
					Math.random();
				}
			});

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			
			const result = measurePerformance('test-function', mockFn);
			
			expect(result).toBeUndefined();
			expect(mockFn).toHaveBeenCalled();
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-function took'));
			
			consoleSpy.mockRestore();
		});
	});

	describe('measureAsyncPerformance', () => {
		it('should measure asynchronous function performance', async () => {
			const mockFn = vi.fn(async () => {
				await new Promise(resolve => setTimeout(resolve, 10));
				return 'result';
			});

			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			
			const result = await measureAsyncPerformance('test-async-function', mockFn);
			
			expect(result).toBe('result');
			expect(mockFn).toHaveBeenCalled();
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('test-async-function took'));
			
			consoleSpy.mockRestore();
		});
	});
});
