// Performance monitoring and analytics
export class PerformanceAnalytics {
	private static instance: PerformanceAnalytics;
	private metrics: Map<string, number> = new Map();
	private observers: PerformanceObserver[] = [];

	private constructor() {
		// Only initialize performance monitoring in the browser
		if (typeof window !== 'undefined') {
			this.initializePerformanceMonitoring();
		}
	}

	public static getInstance(): PerformanceAnalytics {
		if (!PerformanceAnalytics.instance) {
			PerformanceAnalytics.instance = new PerformanceAnalytics();
		}
		return PerformanceAnalytics.instance;
	}

	private initializePerformanceMonitoring() {
		// Only run in browser environment
		if (typeof window === 'undefined') return;
		
		// Monitor Core Web Vitals
		this.observeLCP();
		this.observeFID();
		this.observeCLS();
		this.observeFCP();
		this.observeTTFB();
	}

	private observeLCP() {
		if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				const lastEntry = entries[entries.length - 1];
				this.metrics.set('LCP', lastEntry.startTime);
				this.reportMetric('LCP', lastEntry.startTime);
			});
			observer.observe({ entryTypes: ['largest-contentful-paint'] });
			this.observers.push(observer);
		}
	}

	private observeFID() {
		if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					const fidEntry = entry as PerformanceEventTiming;
					if (fidEntry.processingStart && fidEntry.startTime) {
						this.metrics.set('FID', fidEntry.processingStart - fidEntry.startTime);
						this.reportMetric('FID', fidEntry.processingStart - fidEntry.startTime);
					}
				});
			});
			observer.observe({ entryTypes: ['first-input'] });
			this.observers.push(observer);
		}
	}

	private observeCLS() {
		if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
			let clsValue = 0;
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry: any) => {
					if (!entry.hadRecentInput) {
						clsValue += entry.value;
					}
				});
				this.metrics.set('CLS', clsValue);
				this.reportMetric('CLS', clsValue);
			});
			observer.observe({ entryTypes: ['layout-shift'] });
			this.observers.push(observer);
		}
	}

	private observeFCP() {
		if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					this.metrics.set('FCP', entry.startTime);
					this.reportMetric('FCP', entry.startTime);
				});
			});
			observer.observe({ entryTypes: ['paint'] });
			this.observers.push(observer);
		}
	}

	private observeTTFB() {
		if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
			const observer = new PerformanceObserver((list) => {
				const entries = list.getEntries();
				entries.forEach((entry) => {
					if (entry.entryType === 'navigation') {
						const navEntry = entry as PerformanceNavigationTiming;
						if (navEntry.responseStart && navEntry.requestStart) {
							const ttfb = navEntry.responseStart - navEntry.requestStart;
							this.metrics.set('TTFB', ttfb);
							this.reportMetric('TTFB', ttfb);
						}
					}
				});
			});
			observer.observe({ entryTypes: ['navigation'] });
			this.observers.push(observer);
		}
	}

	private reportMetric(name: string, value: number) {
		// In a real application, you would send this to your analytics service
		console.log(`Performance Metric: ${name} = ${value}ms`);
		
		// Example: Send to analytics service
		// analytics.track('performance_metric', {
		//   metric_name: name,
		//   value: value,
		//   timestamp: Date.now()
		// });
	}

	public getMetrics(): Map<string, number> {
		return new Map(this.metrics);
	}

	public getMetric(name: string): number | undefined {
		return this.metrics.get(name);
	}

	public trackCustomMetric(name: string, value: number) {
		this.metrics.set(name, value);
		this.reportMetric(name, value);
	}

	public trackUserAction(action: string, properties?: Record<string, any>) {
		console.log(`User Action: ${action}`, properties);
		
		// In a real application, you would send this to your analytics service
		// analytics.track(action, properties);
	}

	public trackError(error: Error, context?: Record<string, any>) {
		console.error('Error tracked:', error, context);
		
		// In a real application, you would send this to your error tracking service
		// errorTracking.captureException(error, context);
	}

	public trackPageView(page: string, properties?: Record<string, any>) {
		console.log(`Page View: ${page}`, properties);
		
		// In a real application, you would send this to your analytics service
		// analytics.page(page, properties);
	}

	public destroy() {
		if (typeof window !== 'undefined') {
			this.observers.forEach(observer => observer.disconnect());
			this.observers = [];
		}
	}
}

// Export singleton instance
export const analytics = PerformanceAnalytics.getInstance();

// Utility functions for common tracking
export function trackAlgorithmExecution(algorithmId: string, duration: number, steps: number) {
	analytics.trackCustomMetric('algorithm_execution_time', duration);
	analytics.trackCustomMetric('algorithm_steps', steps);
	analytics.trackUserAction('algorithm_executed', {
		algorithm_id: algorithmId,
		duration,
		steps
	});
}

export function trackUserInteraction(interaction: string, component: string) {
	analytics.trackUserAction('user_interaction', {
		interaction,
		component,
		timestamp: Date.now()
	});
}

export function trackPerformanceIssue(issue: string, details: Record<string, any>) {
	analytics.trackError(new Error(`Performance Issue: ${issue}`), details);
}
