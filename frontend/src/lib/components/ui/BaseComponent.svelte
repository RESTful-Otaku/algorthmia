<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { clsx } from 'clsx';

	// Common props for all UI components
	interface BaseComponentProps {
		class?: string;
		disabled?: boolean;
		loading?: boolean;
		onClick?: () => void;
		children?: any;
	}

	// Common styling utilities
	export function createClasses(
		baseClasses: string,
		variantClasses: string,
		sizeClasses: string,
		stateClasses: string,
		customClasses: string
	): string {
		return twMerge(
			baseClasses,
			variantClasses,
			sizeClasses,
			stateClasses,
			customClasses
		);
	}

	// Common state classes
	export const stateClasses = {
		disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
		loading: 'opacity-75 cursor-wait',
		interactive: 'cursor-pointer hover:scale-105 transition-transform duration-200',
		focus: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
	};

	// Common size variants
	export const sizeVariants = {
		xs: 'px-2 py-1 text-xs',
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
		xl: 'px-8 py-4 text-lg'
	};

	// Common color variants
	export const colorVariants = {
		primary: 'bg-primary-600 hover:bg-primary-700 text-white',
		secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900 dark:bg-secondary-700 dark:hover:bg-secondary-600 dark:text-secondary-100',
		outline: 'border border-secondary-300 hover:bg-secondary-50 text-secondary-700 dark:border-secondary-600 dark:hover:bg-secondary-800 dark:text-secondary-300',
		ghost: 'hover:bg-secondary-100 text-secondary-700 dark:hover:bg-secondary-800 dark:text-secondary-300',
		danger: 'bg-error-600 hover:bg-error-700 text-white',
		success: 'bg-success-600 hover:bg-success-700 text-white',
		warning: 'bg-warning-600 hover:bg-warning-700 text-white'
	};

	// Common animation utilities
	export const animations = {
		fadeIn: 'animate-fade-in',
		slideIn: 'animate-slide-in',
		scaleIn: 'animate-scale-in',
		bounce: 'animate-bounce',
		spin: 'animate-spin',
		pulse: 'animate-pulse'
	};

	// Common loading spinner component
	export function LoadingSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
		const sizeClasses = {
			sm: 'h-4 w-4',
			md: 'h-6 w-6',
			lg: 'h-8 w-8'
		};

		return `
			<svg class="animate-spin ${sizeClasses[size]}" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		`;
	}

	// Common error handling
	export function handleError(error: unknown, fallbackMessage = 'An error occurred'): string {
		if (error instanceof Error) {
			return error.message;
		}
		return fallbackMessage;
	}

	// Common accessibility utilities
	export const a11y = {
		// ARIA labels for common actions
		labels: {
			close: 'Close',
			open: 'Open',
			loading: 'Loading',
			error: 'Error',
			success: 'Success',
			info: 'Information'
		},
		// Common ARIA attributes
		attributes: {
			button: 'role="button" tabindex="0"',
			modal: 'role="dialog" aria-modal="true"',
			alert: 'role="alert"',
			status: 'role="status"'
		}
	};
</script>
