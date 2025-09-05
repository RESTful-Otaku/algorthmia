// Centralized validation utilities

export interface ValidationRule<T = any> {
	validate: (value: T) => boolean;
	message: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

// Common validation rules
export const validationRules = {
	required: <T>(message = 'This field is required'): ValidationRule<T> => ({
		validate: (value: T) => {
			if (value === null || value === undefined) return false;
			if (typeof value === 'string') return value.trim().length > 0;
			if (Array.isArray(value)) return value.length > 0;
			return true;
		},
		message
	}),

	minLength: (min: number, message?: string): ValidationRule<string> => ({
		validate: (value: string) => value.length >= min,
		message: message || `Must be at least ${min} characters long`
	}),

	maxLength: (max: number, message?: string): ValidationRule<string> => ({
		validate: (value: string) => value.length <= max,
		message: message || `Must be no more than ${max} characters long`
	}),

	min: (min: number, message?: string): ValidationRule<number> => ({
		validate: (value: number) => value >= min,
		message: message || `Must be at least ${min}`
	}),

	max: (max: number, message?: string): ValidationRule<number> => ({
		validate: (value: number) => value <= max,
		message: message || `Must be no more than ${max}`
	}),

	email: (message = 'Please enter a valid email address'): ValidationRule<string> => ({
		validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
		message
	}),

	url: (message = 'Please enter a valid URL'): ValidationRule<string> => ({
		validate: (value: string) => /^https?:\/\/.+/.test(value),
		message
	}),

	alphanumeric: (message = 'Must contain only letters and numbers'): ValidationRule<string> => ({
		validate: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
		message
	}),

	numeric: (message = 'Must contain only numbers'): ValidationRule<string> => ({
		validate: (value: string) => /^\d+$/.test(value),
		message
	}),

	pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
		validate: (value: string) => regex.test(value),
		message
	}),

	arraySize: (min: number, max: number, message?: string): ValidationRule<any[]> => ({
		validate: (value: any[]) => value.length >= min && value.length <= max,
		message: message || `Must contain between ${min} and ${max} items`
	})
};

// Validator class
export class Validator<T = any> {
	private rules: ValidationRule<T>[] = [];

	constructor(rules: ValidationRule<T>[] = []) {
		this.rules = rules;
	}

	// Add a validation rule
	addRule(rule: ValidationRule<T>): Validator<T> {
		this.rules.push(rule);
		return this;
	}

	// Validate a value against all rules
	validate(value: T): ValidationResult {
		const errors: string[] = [];

		for (const rule of this.rules) {
			if (!rule.validate(value)) {
				errors.push(rule.message);
			}
		}

		return {
			isValid: errors.length === 0,
			errors
		};
	}

	// Validate multiple values
	validateMultiple(values: Record<string, T>): Record<string, ValidationResult> {
		const results: Record<string, ValidationResult> = {};

		for (const [key, value] of Object.entries(values)) {
			results[key] = this.validate(value);
		}

		return results;
	}
}

// Convenience functions for common validations
export const validate = {
	// String validations
	string: (value: string, rules: ValidationRule<string>[] = []): ValidationResult => {
		const validator = new Validator(rules);
		return validator.validate(value);
	},

	// Number validations
	number: (value: number, rules: ValidationRule<number>[] = []): ValidationResult => {
		const validator = new Validator(rules);
		return validator.validate(value);
	},

	// Array validations
	array: (value: any[], rules: ValidationRule<any[]>[] = []): ValidationResult => {
		const validator = new Validator(rules);
		return validator.validate(value);
	},

	// Email validation
	email: (value: string): ValidationResult => {
		return validate.string(value, [validationRules.email()]);
	},

	// URL validation
	url: (value: string): ValidationResult => {
		return validate.string(value, [validationRules.url()]);
	},

	// Required field validation
	required: <T>(value: T): ValidationResult => {
		const validator = new Validator([validationRules.required()]);
		return validator.validate(value);
	}
};

// Form validation helper
export class FormValidator {
	private validators: Record<string, Validator> = {};

	// Add a field validator
	addField(fieldName: string, validator: Validator): FormValidator {
		this.validators[fieldName] = validator;
		return this;
	}

	// Validate all fields
	validateForm(data: Record<string, any>): {
		isValid: boolean;
		errors: Record<string, string[]>;
		fieldErrors: Record<string, ValidationResult>;
	} {
		const errors: Record<string, string[]> = {};
		const fieldErrors: Record<string, ValidationResult> = {};
		let isValid = true;

		for (const [fieldName, validator] of Object.entries(this.validators)) {
			const value = data[fieldName];
			const result = validator.validate(value);
			
			fieldErrors[fieldName] = result;
			
			if (!result.isValid) {
				errors[fieldName] = result.errors;
				isValid = false;
			}
		}

		return {
			isValid,
			errors,
			fieldErrors
		};
	}

	// Validate a single field
	validateField(fieldName: string, value: any): ValidationResult {
		const validator = this.validators[fieldName];
		if (!validator) {
			return { isValid: true, errors: [] };
		}
		return validator.validate(value);
	}
}

// Algorithm-specific validations
export const algorithmValidations = {
	arraySize: (size: number): ValidationResult => {
		return validate.number(size, [
			validationRules.min(1, 'Array size must be at least 1'),
			validationRules.max(1000, 'Array size cannot exceed 1000')
		]);
	},

	speed: (speed: number): ValidationResult => {
		return validate.number(speed, [
			validationRules.min(1, 'Speed must be at least 1'),
			validationRules.max(10, 'Speed cannot exceed 10')
		]);
	},

	algorithmId: (id: string): ValidationResult => {
		return validate.string(id, [
			validationRules.required('Algorithm ID is required'),
			validationRules.pattern(/^[a-zA-Z0-9_-]+$/, 'Algorithm ID must contain only letters, numbers, underscores, and hyphens')
		]);
	}
};

// Specific validation functions for API
export function validateAlgorithmId(id: string): ValidationResult {
	return algorithmValidations.algorithmId(id);
}

export function validateAlgorithmConfig(config: any): ValidationResult {
	const errors: string[] = [];
	
	// Validate array size
	const arraySizeResult = algorithmValidations.arraySize(config.array_size);
	if (!arraySizeResult.isValid) {
		errors.push(...arraySizeResult.errors);
	}
	
	// Validate speed
	const speedResult = algorithmValidations.speed(config.speed);
	if (!speedResult.isValid) {
		errors.push(...speedResult.errors);
	}
	
	// Validate data if provided
	if (config.data && Array.isArray(config.data)) {
		if (config.data.length !== config.array_size) {
			errors.push('Data length must match array size');
		}
		
		// Validate data values
		for (let i = 0; i < config.data.length; i++) {
			if (typeof config.data[i] !== 'number' || isNaN(config.data[i])) {
				errors.push(`Data value at index ${i} must be a valid number`);
			}
			if (config.data[i] < -10000 || config.data[i] > 10000) {
				errors.push(`Data value at index ${i} is out of range (-10000 to 10000)`);
			}
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

// Input sanitization
export const sanitize = {
	// Remove HTML tags
	html: (input: string): string => {
		const div = document.createElement('div');
		div.textContent = input;
		return div.innerHTML;
	},

	// Remove special characters
	alphanumeric: (input: string): string => {
		return input.replace(/[^a-zA-Z0-9]/g, '');
	},

	// Trim whitespace
	trim: (input: string): string => {
		return input.trim();
	},

	// Convert to lowercase
	lowercase: (input: string): string => {
		return input.toLowerCase();
	},

	// Convert to uppercase
	uppercase: (input: string): string => {
		return input.toUpperCase();
	}
};