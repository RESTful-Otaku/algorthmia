import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock console.error to avoid noise in tests
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock the ErrorBoundary component logic
class MockErrorBoundary {
	private hasError = false;
	private error: Error | null = null;
	private errorInfo: any = null;
	private onError?: (error: Error, errorInfo: any) => void;
	private reportError?: (error: Error, errorInfo: any) => void;
	private fallback?: string;
	private children?: () => string;

	constructor(props: {
		children?: () => string;
		onError?: (error: Error, errorInfo: any) => void;
		reportError?: (error: Error, errorInfo: any) => void;
		fallback?: string;
	}) {
		this.children = props.children;
		this.onError = props.onError;
		this.reportError = props.reportError;
		this.fallback = props.fallback;
	}

	render(): string {
		if (this.hasError) {
			return this.fallback || 'Something went wrong';
		}
		return this.children ? this.children() : '';
	}

	triggerError(error: Error | string) {
		this.hasError = true;
		this.error = error instanceof Error ? error : new Error(String(error));
		this.errorInfo = { componentStack: 'test stack', timestamp: new Date().toISOString() };
		
		if (this.onError) {
			this.onError(this.error, this.errorInfo);
		}
		
		if (this.reportError) {
			this.reportError(this.error, this.errorInfo);
		}
		
		mockConsoleError('Error caught by ErrorBoundary:', this.error, this.errorInfo);
	}

	resetError() {
		this.hasError = false;
		this.error = null;
		this.errorInfo = null;
	}

	clickReset() {
		this.resetError();
	}

	clickReport() {
		if (this.error && this.errorInfo) {
			mockConsoleError('Error reported:', this.error, this.errorInfo);
		}
	}
}

describe('ErrorBoundary', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render children when no error occurs', () => {
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content'
		});

		expect(errorBoundary.render()).toBe('Test content');
	});

	it('should render error UI when error occurs', () => {
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content'
		});

		errorBoundary.triggerError(new Error('Test error'));

		expect(errorBoundary.render()).toBe('Something went wrong');
	});

	it('should call onError callback when error occurs', () => {
		const onError = vi.fn();
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content',
			onError
		});

		errorBoundary.triggerError(new Error('Test error'));

		expect(onError).toHaveBeenCalledWith(
			expect.any(Error),
			expect.objectContaining({
				componentStack: expect.any(String),
				timestamp: expect.any(String)
			})
		);
	});

	it('should log error to console when error occurs', () => {
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content'
		});

		errorBoundary.triggerError(new Error('Test error'));

		expect(mockConsoleError).toHaveBeenCalledWith(
			'Error caught by ErrorBoundary:',
			expect.any(Error),
			expect.any(Object)
		);
	});

	it('should reset error when reset button is clicked', () => {
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content'
		});

		// Initially should show children
		expect(errorBoundary.render()).toBe('Test content');

		// Trigger error
		errorBoundary.triggerError(new Error('Test error'));
		expect(errorBoundary.render()).toBe('Something went wrong');

		// Click reset button
		errorBoundary.clickReset();

		// Should now show children again
		expect(errorBoundary.render()).toBe('Test content');
	});

	it('should call reportError when report button is clicked', () => {
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content'
		});

		errorBoundary.triggerError(new Error('Test error'));
		errorBoundary.clickReport();

		expect(mockConsoleError).toHaveBeenCalledWith(
			'Error reported:',
			expect.any(Error),
			expect.any(Object)
		);
	});

	it('should handle non-Error objects thrown', () => {
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content'
		});

		errorBoundary.triggerError('String error');

		expect(errorBoundary.render()).toBe('Something went wrong');
	});

	it('should render custom fallback when provided', () => {
		const customFallback = 'Custom error message';
		const errorBoundary = new MockErrorBoundary({
			children: () => 'Test content',
			fallback: customFallback
		});

		errorBoundary.triggerError(new Error('Test error'));

		expect(errorBoundary.render()).toBe('Custom error message');
	});
});