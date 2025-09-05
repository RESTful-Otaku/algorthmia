// Performance optimization utilities

// Debounce function to limit function calls
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

// Memoization for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
	fn: T,
	keyGenerator?: (...args: Parameters<T>) => string
): T {
	const cache = new Map<string, ReturnType<T>>();
	
	return ((...args: Parameters<T>) => {
		const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
		
		if (cache.has(key)) {
			return cache.get(key);
		}
		
		const result = fn(...args);
		cache.set(key, result);
		return result;
	}) as T;
}

// Lazy loading for components
export function lazyLoad<T>(
	importFn: () => Promise<{ default: T }>
): () => Promise<T> {
	let component: T | null = null;
	let promise: Promise<T> | null = null;
	
	return () => {
		if (component) {
			return Promise.resolve(component);
		}
		
		if (promise) {
			return promise;
		}
		
		promise = importFn().then(module => {
			component = module.default;
			return component;
		});
		
		return promise;
	};
}

// Virtual scrolling helper
export function calculateVisibleItems(
	containerHeight: number,
	itemHeight: number,
	scrollTop: number,
	totalItems: number
) {
	const visibleCount = Math.ceil(containerHeight / itemHeight);
	const startIndex = Math.floor(scrollTop / itemHeight);
	const endIndex = Math.min(startIndex + visibleCount, totalItems);
	
	return {
		startIndex,
		endIndex,
		visibleCount
	};
}

// Image lazy loading
export function createIntersectionObserver(
	callback: (entries: IntersectionObserverEntry[]) => void,
	options: IntersectionObserverInit = {}
): IntersectionObserver {
	return new IntersectionObserver(callback, {
		rootMargin: '50px',
		threshold: 0.1,
		...options
	});
}

// Performance monitoring
export class PerformanceMonitor {
	private static instance: PerformanceMonitor;
	private marks: Map<string, number> = new Map();
	
	static getInstance(): PerformanceMonitor {
		if (!PerformanceMonitor.instance) {
			PerformanceMonitor.instance = new PerformanceMonitor();
		}
		return PerformanceMonitor.instance;
	}
	
	mark(name: string): void {
		this.marks.set(name, performance.now());
	}
	
	measure(name: string, startMark: string, endMark?: string): number {
		const start = this.marks.get(startMark);
		const end = endMark ? this.marks.get(endMark) : performance.now();
		
		if (start === undefined) {
			console.warn(`Start mark "${startMark}" not found`);
			return 0;
		}
		
		const duration = end! - start;
		console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
		return duration;
	}
	
	clear(): void {
		this.marks.clear();
	}
}

// Memory usage monitoring
export function getMemoryUsage(): {
	used: number;
	total: number;
	percentage: number;
} {
	if ('memory' in performance) {
		const memory = (performance as any).memory;
		return {
			used: memory.usedJSHeapSize,
			total: memory.totalJSHeapSize,
			percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
		};
	}
	
	return {
		used: 0,
		total: 0,
		percentage: 0
	};
}

// Bundle size optimization
export function preloadResource(href: string, as: string): void {
	const link = document.createElement('link');
	link.rel = 'preload';
	link.href = href;
	link.as = as;
	document.head.appendChild(link);
}

// Critical resource hints
export function addResourceHints(): void {
	// Preconnect to external domains
	const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
	domains.forEach(domain => {
		const link = document.createElement('link');
		link.rel = 'preconnect';
		link.href = `https://${domain}`;
		document.head.appendChild(link);
	});
}

// Animation performance optimization
export function requestAnimationFrame(callback: FrameRequestCallback): number {
	return window.requestAnimationFrame(callback);
}

export function cancelAnimationFrame(id: number): void {
	window.cancelAnimationFrame(id);
}

// Batch DOM updates
export function batchDOMUpdates(updates: (() => void)[]): void {
	requestAnimationFrame(() => {
		updates.forEach(update => update());
	});
}

// Efficient array operations
export function chunk<T>(array: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

export function unique<T>(array: T[]): T[] {
	return [...new Set(array)];
}

export function groupBy<T, K extends string | number>(
	array: T[],
	keyFn: (item: T) => K
): Record<K, T[]> {
	return array.reduce((groups, item) => {
		const key = keyFn(item);
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(item);
		return groups;
	}, {} as Record<K, T[]>);
}

// Web Workers for heavy computations
export function createWorker(script: string): Worker {
	const blob = new Blob([script], { type: 'application/javascript' });
	const url = URL.createObjectURL(blob);
	return new Worker(url);
}

// Service Worker registration
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log('Service Worker registered:', registration);
			return registration;
		} catch (error) {
			console.error('Service Worker registration failed:', error);
			return null;
		}
	}
	return null;
}
