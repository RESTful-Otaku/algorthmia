// Input validation and sanitization utilities

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp;
	custom?: (value: any) => string | null;
}

// Sanitize string input
export function sanitizeString(input: string): string {
	if (typeof input !== 'string') {
		return '';
	}
	
	// Remove potentially dangerous characters
	return input
		.replace(/[<>]/g, '') // Remove < and >
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+=/gi, '') // Remove event handlers
		.trim();
}

// Validate string input
export function validateString(value: string, rules: ValidationRule = {}): ValidationResult {
	const errors: string[] = [];
	
	if (rules.required && (!value || value.trim().length === 0)) {
		errors.push('This field is required');
		return { isValid: false, errors };
	}
	
	if (value && rules.minLength && value.length < rules.minLength) {
		errors.push(`Minimum length is ${rules.minLength} characters`);
	}
	
	if (value && rules.maxLength && value.length > rules.maxLength) {
		errors.push(`Maximum length is ${rules.maxLength} characters`);
	}
	
	if (value && rules.pattern && !rules.pattern.test(value)) {
		errors.push('Invalid format');
	}
	
	if (value && rules.custom) {
		const customError = rules.custom(value);
		if (customError) {
			errors.push(customError);
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

// Validate number input
export function validateNumber(value: number, rules: { min?: number; max?: number; required?: boolean } = {}): ValidationResult {
	const errors: string[] = [];
	
	if (rules.required && (value === null || value === undefined || isNaN(value))) {
		errors.push('This field is required');
		return { isValid: false, errors };
	}
	
	if (!isNaN(value)) {
		if (rules.min !== undefined && value < rules.min) {
			errors.push(`Minimum value is ${rules.min}`);
		}
		
		if (rules.max !== undefined && value > rules.max) {
			errors.push(`Maximum value is ${rules.max}`);
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

// Validate array size
export function validateArraySize(size: number): ValidationResult {
	return validateNumber(size, {
		required: true,
		min: 1,
		max: 1000
	});
}

// Validate algorithm ID
export function validateAlgorithmId(id: string): ValidationResult {
	return validateString(id, {
		required: true,
		minLength: 1,
		maxLength: 50,
		pattern: /^[a-zA-Z0-9_-]+$/
	});
}

// Validate search query
export function validateSearchQuery(query: string): ValidationResult {
	return validateString(query, {
		maxLength: 100,
		pattern: /^[a-zA-Z0-9\s_-]*$/
	});
}

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
	if (typeof html !== 'string') {
		return '';
	}
	
	// Basic HTML sanitization - in production, use a proper library like DOMPurify
	return html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
		.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
}

// Validate email
export function validateEmail(email: string): ValidationResult {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return validateString(email, {
		required: true,
		pattern: emailPattern
	});
}

// Validate URL
export function validateUrl(url: string): ValidationResult {
	try {
		new URL(url);
		return { isValid: true, errors: [] };
	} catch {
		return { isValid: false, errors: ['Invalid URL format'] };
	}
}

// Sanitize object properties
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
	const sanitized = { ...obj };
	
	for (const key in sanitized) {
		if (typeof sanitized[key] === 'string') {
			sanitized[key] = sanitizeString(sanitized[key]) as T[Extract<keyof T, string>];
		} else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
			sanitized[key] = sanitizeObject(sanitized[key]) as T[Extract<keyof T, string>];
		}
	}
	
	return sanitized;
}

// Validate algorithm configuration
export function validateAlgorithmConfig(config: any): ValidationResult {
	const errors: string[] = [];
	
	if (!config || typeof config !== 'object') {
		errors.push('Configuration must be an object');
		return { isValid: false, errors };
	}
	
	// Validate array size
	if (config.arraySize !== undefined) {
		const arraySizeResult = validateArraySize(config.arraySize);
		if (!arraySizeResult.isValid) {
			errors.push(...arraySizeResult.errors);
		}
	}
	
	// Validate speed
	if (config.speed !== undefined) {
		const speedResult = validateNumber(config.speed, { min: 1, max: 10 });
		if (!speedResult.isValid) {
			errors.push(...speedResult.errors);
		}
	}
	
	// Validate data array
	if (config.data && Array.isArray(config.data)) {
		if (config.data.length > 1000) {
			errors.push('Data array too large');
		}
		
		for (let i = 0; i < config.data.length; i++) {
			if (typeof config.data[i] !== 'number' || isNaN(config.data[i])) {
				errors.push(`Invalid data at index ${i}`);
			}
			if (config.data[i] < -10000 || config.data[i] > 10000) {
				errors.push(`Data value at index ${i} is out of range`);
			}
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}
