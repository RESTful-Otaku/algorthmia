// Centralized error handling utilities

export interface ErrorInfo {
	message: string;
	code?: string;
	status?: number;
	context?: Record<string, any>;
	timestamp: Date;
}

export class AppError extends Error {
	public readonly code: string;
	public readonly status: number;
	public readonly context: Record<string, any>;

	constructor(
		message: string,
		code: string = 'UNKNOWN_ERROR',
		status: number = 500,
		context: Record<string, any> = {}
	) {
		super(message);
		this.name = 'AppError';
		this.code = code;
		this.status = status;
		this.context = context;
	}
}

// Error types for better categorization
export const ErrorTypes = {
	NETWORK: 'NETWORK_ERROR',
	VALIDATION: 'VALIDATION_ERROR',
	AUTHENTICATION: 'AUTHENTICATION_ERROR',
	AUTHORIZATION: 'AUTHORIZATION_ERROR',
	NOT_FOUND: 'NOT_FOUND_ERROR',
	RATE_LIMIT: 'RATE_LIMIT_ERROR',
	INTERNAL: 'INTERNAL_ERROR',
	UNKNOWN: 'UNKNOWN_ERROR'
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

// Error handler class
export class ErrorHandler {
	private static instance: ErrorHandler;
	private errorLog: ErrorInfo[] = [];
	private maxLogSize = 100;

	private constructor() {}

	public static getInstance(): ErrorHandler {
		if (!ErrorHandler.instance) {
			ErrorHandler.instance = new ErrorHandler();
		}
		return ErrorHandler.instance;
	}

	// Handle different types of errors
	public handleError(error: unknown, context?: Record<string, any>): AppError {
		let appError: AppError;

		if (error instanceof AppError) {
			appError = error;
		} else if (error instanceof Error) {
			appError = new AppError(
				error.message,
				ErrorTypes.UNKNOWN,
				500,
				{ originalError: error.name, ...context }
			);
		} else {
			appError = new AppError(
				'An unknown error occurred',
				ErrorTypes.UNKNOWN,
				500,
				{ originalError: String(error), ...context }
			);
		}

		// Log the error
		this.logError(appError);

		return appError;
	}

	// Handle API errors specifically
	public handleAPIError(response: Response, context?: Record<string, any>): AppError {
		let message = 'API request failed';
		let code: ErrorType = ErrorTypes.NETWORK;
		let status = response.status;

		switch (response.status) {
			case 400:
				message = 'Bad request';
				code = ErrorTypes.VALIDATION;
				break;
			case 401:
				message = 'Unauthorized';
				code = ErrorTypes.AUTHENTICATION;
				break;
			case 403:
				message = 'Forbidden';
				code = ErrorTypes.AUTHORIZATION;
				break;
			case 404:
				message = 'Not found';
				code = ErrorTypes.NOT_FOUND;
				break;
			case 429:
				message = 'Rate limit exceeded';
				code = ErrorTypes.RATE_LIMIT;
				break;
			case 500:
				message = 'Internal server error';
				code = ErrorTypes.INTERNAL;
				break;
		}

		return new AppError(message, code, status, {
			url: response.url,
			statusText: response.statusText,
			...context
		});
	}

	// Log error for debugging
	private logError(error: AppError): void {
		const errorInfo: ErrorInfo = {
			message: error.message,
			code: error.code,
			status: error.status,
			context: error.context,
			timestamp: new Date()
		};

		this.errorLog.unshift(errorInfo);

		// Keep only the most recent errors
		if (this.errorLog.length > this.maxLogSize) {
			this.errorLog = this.errorLog.slice(0, this.maxLogSize);
		}

		// Log to console in development
		if (import.meta.env.DEV) {
			console.error('Error logged:', errorInfo);
		}
	}

	// Get error log for debugging
	public getErrorLog(): ErrorInfo[] {
		return [...this.errorLog];
	}

	// Clear error log
	public clearErrorLog(): void {
		this.errorLog = [];
	}

	// Get user-friendly error message
	public getUserFriendlyMessage(error: AppError): string {
		const messages: Record<string, string> = {
			[ErrorTypes.NETWORK]: 'Network connection failed. Please check your internet connection.',
			[ErrorTypes.VALIDATION]: 'Please check your input and try again.',
			[ErrorTypes.AUTHENTICATION]: 'Please log in to continue.',
			[ErrorTypes.AUTHORIZATION]: 'You do not have permission to perform this action.',
			[ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
			[ErrorTypes.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
			[ErrorTypes.INTERNAL]: 'Something went wrong on our end. Please try again later.',
			[ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again.'
		};

		return messages[error.code] || messages[ErrorTypes.UNKNOWN];
	}
}

// Convenience function to get error handler instance
export const errorHandler = ErrorHandler.getInstance();

// Utility function to create specific error types
export const createError = {
	network: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.NETWORK, 0, context),
	
	validation: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.VALIDATION, 400, context),
	
	authentication: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.AUTHENTICATION, 401, context),
	
	authorization: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.AUTHORIZATION, 403, context),
	
	notFound: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.NOT_FOUND, 404, context),
	
	rateLimit: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.RATE_LIMIT, 429, context),
	
	internal: (message: string, context?: Record<string, any>) =>
		new AppError(message, ErrorTypes.INTERNAL, 500, context)
};
