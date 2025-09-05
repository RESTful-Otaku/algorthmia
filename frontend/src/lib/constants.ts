// Application constants

// API Configuration
export const API_CONFIG = {
	BASE_URL: '', // Use relative paths to work with Vite proxy
	ENDPOINTS: {
		HEALTH: '/api/v1/health',
		ALGORITHMS: '/api/v1/algorithms',
		ALGORITHM_BY_ID: (id: string) => `/api/v1/algorithms/${id}`,
		ALGORITHM_CONFIG: (id: string) => `/api/v1/algorithms/${id}/config`,
		EXECUTE_ALGORITHM: (id: string) => `/api/v1/algorithms/${id}/execute`
	},
	TIMEOUT: 30000, // 30 seconds
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000 // 1 second
} as const;

// Algorithm Configuration
export const ALGORITHM_CONFIG = {
	MAX_ARRAY_SIZE: 1000,
	MIN_ARRAY_SIZE: 1,
	DEFAULT_ARRAY_SIZE: 20,
	MAX_SPEED: 10,
	MIN_SPEED: 1,
	DEFAULT_SPEED: 5,
	SPEED_STEP: 1
} as const;

// UI Configuration
export const UI_CONFIG = {
	ANIMATION_DURATION: 200,
	DEBOUNCE_DELAY: 300,
	THROTTLE_DELAY: 100,
	NOTIFICATION_DURATION: 3000,
	LOADING_TIMEOUT: 10000,
	MODAL_ANIMATION_DURATION: 300
} as const;

// Theme Configuration
export const THEME_CONFIG = {
	STORAGE_KEY: 'algorthmia-theme',
	DEFAULT_THEME: 'light',
	THEMES: {
		LIGHT: 'light',
		DARK: 'dark',
		SYSTEM: 'system'
	}
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
	THEME: 'algorthmia-theme',
	WELCOME_MODAL: 'hasSeenWelcome',
	USER_PREFERENCES: 'user-preferences',
	ALGORITHM_STATE: 'algorithm-state',
	NOTIFICATIONS: 'notifications'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
	NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
	VALIDATION_ERROR: 'Please check your input and try again.',
	AUTHENTICATION_ERROR: 'Please log in to continue.',
	AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
	NOT_FOUND_ERROR: 'The requested resource was not found.',
	RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
	INTERNAL_ERROR: 'Something went wrong on our end. Please try again later.',
	UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
	ALGORITHM_NOT_FOUND: 'Algorithm not found.',
	INVALID_CONFIG: 'Invalid algorithm configuration.',
	EXECUTION_FAILED: 'Algorithm execution failed.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
	ALGORITHM_LOADED: 'Algorithm loaded successfully.',
	EXECUTION_COMPLETED: 'Algorithm execution completed.',
	CONFIG_SAVED: 'Configuration saved successfully.',
	DATA_GENERATED: 'New data generated successfully.'
} as const;

// Algorithm Types
export const ALGORITHM_TYPES = {
	SORTING: 'sorting',
	SEARCH: 'search',
	GRAPH: 'graph'
} as const;

// Algorithm Categories
export const ALGORITHM_CATEGORIES = {
	COMPARISON_SORT: 'Comparison Sort',
	LINEAR_SORT: 'Linear Sort',
	HYBRID_SORT: 'Hybrid Sort',
	LINEAR_SEARCH: 'Linear Search',
	BINARY_SEARCH: 'Binary Search',
	BREADTH_FIRST: 'Breadth-First Search',
	DEPTH_FIRST: 'Depth-First Search'
} as const;

// Time Complexities
export const TIME_COMPLEXITIES = {
	O_1: 'O(1)',
	O_LOG_N: 'O(log n)',
	O_N: 'O(n)',
	O_N_LOG_N: 'O(n log n)',
	O_N_SQUARED: 'O(n²)',
	O_N_CUBED: 'O(n³)',
	O_2_N: 'O(2ⁿ)',
	O_N_FACTORIAL: 'O(n!)'
} as const;

// Space Complexities
export const SPACE_COMPLEXITIES = {
	O_1: 'O(1)',
	O_LOG_N: 'O(log n)',
	O_N: 'O(n)',
	O_N_LOG_N: 'O(n log n)',
	O_N_SQUARED: 'O(n²)'
} as const;

// Button Variants
export const BUTTON_VARIANTS = {
	PRIMARY: 'primary',
	SECONDARY: 'secondary',
	OUTLINE: 'outline',
	GHOST: 'ghost',
	DANGER: 'danger',
	SUCCESS: 'success',
	WARNING: 'warning'
} as const;

// Button Sizes
export const BUTTON_SIZES = {
	XS: 'xs',
	SM: 'sm',
	MD: 'md',
	LG: 'lg',
	XL: 'xl'
} as const;

// Input Types
export const INPUT_TYPES = {
	TEXT: 'text',
	EMAIL: 'email',
	PASSWORD: 'password',
	NUMBER: 'number',
	TEL: 'tel',
	URL: 'url',
	SEARCH: 'search'
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
	INFO: 'info'
} as const;

// Animation Types
export const ANIMATION_TYPES = {
	FADE_IN: 'fade-in',
	SLIDE_IN: 'slide-in',
	SCALE_IN: 'scale-in',
	BOUNCE: 'bounce',
	SPIN: 'spin',
	PULSE: 'pulse'
} as const;

// Breakpoints
export const BREAKPOINTS = {
	SM: '640px',
	MD: '768px',
	LG: '1024px',
	XL: '1280px',
	'2XL': '1536px'
} as const;

// Z-Index Layers
export const Z_INDEX = {
	MODAL: 1000,
	OVERLAY: 900,
	HEADER: 800,
	SIDEBAR: 700,
	TOOLTIP: 600,
	NOTIFICATION: 500,
	CONTENT: 100
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	URL: /^https?:\/\/.+/,
	ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
	NUMERIC: /^\d+$/,
	ALGORITHM_ID: /^[a-zA-Z0-9_-]+$/
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
	LCP: 2500, // Largest Contentful Paint (ms)
	FID: 100,  // First Input Delay (ms)
	CLS: 0.1,  // Cumulative Layout Shift
	FCP: 1800, // First Contentful Paint (ms)
	TTFB: 600  // Time to First Byte (ms)
} as const;

// Accessibility
export const A11Y = {
	ARIA_LABELS: {
		CLOSE: 'Close',
		OPEN: 'Open',
		LOADING: 'Loading',
		ERROR: 'Error',
		SUCCESS: 'Success',
		INFO: 'Information',
		MENU: 'Menu',
		SEARCH: 'Search',
		PLAY: 'Play',
		PAUSE: 'Pause',
		STOP: 'Stop',
		RESET: 'Reset'
	},
	ROLES: {
		BUTTON: 'button',
		MODAL: 'dialog',
		ALERT: 'alert',
		STATUS: 'status',
		MENU: 'menu',
		MENUITEM: 'menuitem'
	}
} as const;
