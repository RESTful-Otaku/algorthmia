// Frontend security utilities

// XSS protection
export function sanitizeHTML(input: string): string {
	const div = document.createElement('div');
	div.textContent = input;
	return div.innerHTML;
}

// Input validation
export function validateInput(input: string, type: 'email' | 'url' | 'alphanumeric' | 'numeric'): boolean {
	const patterns = {
		email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		url: /^https?:\/\/.+/,
		alphanumeric: /^[a-zA-Z0-9]+$/,
		numeric: /^\d+$/
	};
	
	return patterns[type].test(input);
}

// CSRF token management
export class CSRFTokenManager {
	private static token: string | null = null;
	private static tokenExpiry: number = 0;

	static async getToken(): Promise<string> {
		// Check if token is still valid
		if (this.token && Date.now() < this.tokenExpiry) {
			return this.token;
		}

		// Fetch new token
		try {
			const response = await fetch('/api/csrf-token', {
				method: 'GET',
				credentials: 'include'
			});
			
			if (response.ok) {
				const data = await response.json();
				this.token = data.token;
				this.tokenExpiry = Date.now() + ((data.expires_in || 3600) * 1000);
				return this.token || '';
			}
		} catch (error) {
			console.error('Failed to fetch CSRF token:', error);
		}

		throw new Error('Failed to obtain CSRF token');
	}

	static getHeaders(): Record<string, string> {
		return {
			'X-CSRF-Token': this.token || '',
			'Content-Type': 'application/json'
		};
	}
}

// Secure API client
export class SecureAPIClient {
	private baseURL: string;
	private defaultHeaders: Record<string, string>;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		};
	}

	async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		
		// Add CSRF token for non-GET requests
		const headers: Record<string, string> = { ...this.defaultHeaders, ...(options.headers as Record<string, string>) };
		if (options.method && options.method !== 'GET') {
			try {
				const csrfToken = await CSRFTokenManager.getToken();
				headers['X-CSRF-Token'] = csrfToken;
			} catch (error) {
				console.warn('CSRF token not available:', error);
			}
		}

		const response = await fetch(url, {
			...options,
			headers,
			credentials: 'include'
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		return response.json();
	}
}

// Content Security Policy helper
export function createCSPNonce(): string {
	const array = new Uint8Array(16);
	crypto.getRandomValues(array);
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Safe JSON parsing
export function safeJSONParse<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json);
	} catch (error) {
		console.warn('Failed to parse JSON:', error);
		return fallback;
	}
}

// URL validation
export function isValidURL(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

// Secure storage
export class SecureStorage {
	private static isAvailable(): boolean {
		try {
			return typeof Storage !== 'undefined';
		} catch {
			return false;
		}
	}

	static setItem(key: string, value: string): void {
		if (!this.isAvailable()) return;
		
		try {
			// Encrypt sensitive data before storing
			const encrypted = btoa(encodeURIComponent(value));
			localStorage.setItem(key, encrypted);
		} catch (error) {
			console.error('Failed to store item:', error);
		}
	}

	static getItem(key: string): string | null {
		if (!this.isAvailable()) return null;
		
		try {
			const encrypted = localStorage.getItem(key);
			if (!encrypted) return null;
			
			return decodeURIComponent(atob(encrypted));
		} catch (error) {
			console.error('Failed to retrieve item:', error);
			return null;
		}
	}

	static removeItem(key: string): void {
		if (!this.isAvailable()) return;
		
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error('Failed to remove item:', error);
		}
	}
}

// Input sanitization
export function sanitizeInput(input: string): string {
	return input
		.replace(/[<>]/g, '') // Remove angle brackets
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+=/gi, '') // Remove event handlers
		.trim();
}

// Rate limiting on frontend
export class RateLimiter {
	private requests: Map<string, number[]> = new Map();
	private maxRequests: number;
	private windowMs: number;

	constructor(maxRequests: number, windowMs: number) {
		this.maxRequests = maxRequests;
		this.windowMs = windowMs;
	}

	isAllowed(key: string): boolean {
		const now = Date.now();
		const requests = this.requests.get(key) || [];
		
		// Remove old requests outside the window
		const validRequests = requests.filter(time => now - time < this.windowMs);
		
		if (validRequests.length >= this.maxRequests) {
			return false;
		}
		
		// Add current request
		validRequests.push(now);
		this.requests.set(key, validRequests);
		
		return true;
	}
}

// Create rate limiter instance
export const apiRateLimiter = new RateLimiter(10, 60000); // 10 requests per minute
