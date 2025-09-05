// Performance optimization utilities

// Debounce function to limit function calls
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	immediate = false
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;
	
	return function executedFunction(...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			if (!immediate) func(...args);
		};
		
		const callNow = immediate && !timeout;
		
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		
		if (callNow) func(...args);
	};
}

// Throttle function to limit function calls
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	
	return function executedFunction(this: any, ...args: Parameters<T>) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
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

// Lazy loading utility
export function lazyLoad<T>(
	importFn: () => Promise<{ default: T }>,
	fallback?: T
): Promise<T> {
	return importFn().then(module => module.default).catch(() => {
		if (fallback) return fallback;
		throw new Error('Failed to load module');
	});
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
	callback: (entries: IntersectionObserverEntry[]) => void,
	options: IntersectionObserverInit = {}
): IntersectionObserver {
	const defaultOptions: IntersectionObserverInit = {
		root: null,
		rootMargin: '50px',
		threshold: 0.1,
		...options
	};
	
	return new IntersectionObserver(callback, defaultOptions);
}

// Virtual scrolling helper
export function calculateVisibleRange(
	scrollTop: number,
	containerHeight: number,
	itemHeight: number,
	totalItems: number,
	overscan = 5
) {
	const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
	const endIndex = Math.min(
		totalItems - 1,
		Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
	);
	
	return { startIndex, endIndex };
}

// Image optimization
export function optimizeImage(
	src: string,
	width?: number,
	height?: number,
	quality = 80
): string {
	const url = new URL(src);
	
	if (width) url.searchParams.set('w', width.toString());
	if (height) url.searchParams.set('h', height.toString());
	url.searchParams.set('q', quality.toString());
	url.searchParams.set('f', 'auto'); // Auto format
	
	return url.toString();
}

// Bundle size analysis
export function analyzeBundleSize() {
	if (typeof window === 'undefined') return;
	
	const scripts = Array.from(document.querySelectorAll('script[src]'));
	const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
	
	const analysis = {
		scripts: scripts.map(script => ({
			src: script.getAttribute('src'),
			size: 'unknown' // Would need to fetch to get actual size
		})),
		styles: styles.map(style => ({
			href: style.getAttribute('href'),
			size: 'unknown'
		})),
		totalResources: scripts.length + styles.length
	};
	
	console.log('Bundle Analysis:', analysis);
	return analysis;
}

// Memory usage monitoring
export function getMemoryUsage() {
	if (typeof window === 'undefined' || !('memory' in performance)) {
		return null;
	}
	
	const memory = (performance as any).memory;
	return {
		usedJSHeapSize: memory.usedJSHeapSize,
		totalJSHeapSize: memory.totalJSHeapSize,
		jsHeapSizeLimit: memory.jsHeapSizeLimit,
		usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
	};
}

// Performance timing
export function measurePerformance<T>(
	name: string,
	fn: () => T
): T {
	const start = performance.now();
	const result = fn();
	const end = performance.now();
	
	console.log(`${name} took ${end - start} milliseconds`);
	return result;
}

// Async performance measurement
export async function measureAsyncPerformance<T>(
	name: string,
	fn: () => Promise<T>
): Promise<T> {
	const start = performance.now();
	const result = await fn();
	const end = performance.now();
	
	console.log(`${name} took ${end - start} milliseconds`);
	return result;
}

// Resource hints
export function preloadResource(href: string, as: string, type?: string) {
	const link = document.createElement('link');
	link.rel = 'preload';
	link.href = href;
	link.as = as;
	if (type) link.type = type;
	
	document.head.appendChild(link);
}

export function prefetchResource(href: string) {
	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = href;
	
	document.head.appendChild(link);
}

// Critical resource loading
export function loadCriticalResources() {
	// Preload critical fonts
	preloadResource('/fonts/inter.woff2', 'font', 'font/woff2');
	
	// Preload critical CSS
	preloadResource('/styles/critical.css', 'style');
	
	// Prefetch likely next resources
	prefetchResource('/api/algorithms');
}

// Service Worker registration for caching
export async function registerServiceWorker() {
	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log('Service Worker registered:', registration);
			return registration;
		} catch (error) {
			console.error('Service Worker registration failed:', error);
		}
	}
}

// Web Workers for heavy computations
export function createWorker(workerScript: string): Worker {
	return new Worker(workerScript);
}

// Batch DOM updates
export function batchDOMUpdates(updates: (() => void)[]) {
	requestAnimationFrame(() => {
		updates.forEach(update => update());
	});
}

// Efficient event delegation
export function delegateEvent(
	container: Element,
	selector: string,
	event: string,
	handler: (event: Event, target: Element) => void
) {
	container.addEventListener(event, (e) => {
		const target = e.target as Element;
		if (target.matches(selector)) {
			handler(e, target);
		}
	});
}