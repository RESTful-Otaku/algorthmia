// Accessibility utilities for keyboard navigation and screen readers

export function trapFocus(element: HTMLElement) {
	const focusableElements = element.querySelectorAll(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	) as NodeListOf<HTMLElement>;
	
	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Tab') {
			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					lastElement.focus();
					event.preventDefault();
				}
			} else {
				if (document.activeElement === lastElement) {
					firstElement.focus();
					event.preventDefault();
				}
			}
		}
	}

	element.addEventListener('keydown', handleKeyDown);
	
	return () => {
		element.removeEventListener('keydown', handleKeyDown);
	};
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
	const announcement = document.createElement('div');
	announcement.setAttribute('aria-live', priority);
	announcement.setAttribute('aria-atomic', 'true');
	announcement.className = 'sr-only';
	announcement.textContent = message;
	
	document.body.appendChild(announcement);
	
	// Remove after announcement
	setTimeout(() => {
		document.body.removeChild(announcement);
	}, 1000);
}

export function getAriaLabel(element: HTMLElement): string {
	return element.getAttribute('aria-label') || 
		   element.getAttribute('aria-labelledby') || 
		   element.textContent?.trim() || 
		   'Interactive element';
}

export function isElementVisible(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	const style = window.getComputedStyle(element);
	
	return (
		rect.width > 0 &&
		rect.height > 0 &&
		style.visibility !== 'hidden' &&
		style.display !== 'none' &&
		style.opacity !== '0'
	);
}

export function getNextFocusableElement(currentElement: HTMLElement, direction: 'forward' | 'backward' = 'forward'): HTMLElement | null {
	const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
	const allFocusable = Array.from(document.querySelectorAll(focusableSelector)) as HTMLElement[];
	
	const currentIndex = allFocusable.indexOf(currentElement);
	if (currentIndex === -1) return null;
	
	const nextIndex = direction === 'forward' 
		? (currentIndex + 1) % allFocusable.length
		: (currentIndex - 1 + allFocusable.length) % allFocusable.length;
	
	return allFocusable[nextIndex] || null;
}

export function focusNextElement(currentElement: HTMLElement, direction: 'forward' | 'backward' = 'forward') {
	const nextElement = getNextFocusableElement(currentElement, direction);
	if (nextElement && isElementVisible(nextElement)) {
		nextElement.focus();
	}
}

export function handleEscapeKey(callback: () => void) {
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			callback();
		}
	}
	
	document.addEventListener('keydown', handleKeyDown);
	
	return () => {
		document.removeEventListener('keydown', handleKeyDown);
	};
}

export function handleArrowKeys(
	element: HTMLElement,
	onUp?: () => void,
	onDown?: () => void,
	onLeft?: () => void,
	onRight?: () => void
) {
	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				onUp?.();
				break;
			case 'ArrowDown':
				event.preventDefault();
				onDown?.();
				break;
			case 'ArrowLeft':
				event.preventDefault();
				onLeft?.();
				break;
			case 'ArrowRight':
				event.preventDefault();
				onRight?.();
				break;
		}
	}
	
	element.addEventListener('keydown', handleKeyDown);
	
	return () => {
		element.removeEventListener('keydown', handleKeyDown);
	};
}

export function createFocusIndicator() {
	const indicator = document.createElement('div');
	indicator.className = 'focus-indicator';
	indicator.style.cssText = `
		position: absolute;
		pointer-events: none;
		z-index: 9999;
		border: 2px solid #3b82f6;
		border-radius: 4px;
		transition: all 0.1s ease;
		opacity: 0;
	`;
	
	document.body.appendChild(indicator);
	
	return {
		show: (element: HTMLElement) => {
			const rect = element.getBoundingClientRect();
			indicator.style.left = `${rect.left - 2}px`;
			indicator.style.top = `${rect.top - 2}px`;
			indicator.style.width = `${rect.width + 4}px`;
			indicator.style.height = `${rect.height + 4}px`;
			indicator.style.opacity = '1';
		},
		hide: () => {
			indicator.style.opacity = '0';
		},
		destroy: () => {
			document.body.removeChild(indicator);
		}
	};
}

export function setupKeyboardShortcuts() {
	const shortcuts = new Map<string, () => void>();
	
	function handleKeyDown(event: KeyboardEvent) {
		const key = event.ctrlKey || event.metaKey ? `ctrl+${event.key}` : event.key;
		const shortcut = shortcuts.get(key);
		
		if (shortcut) {
			event.preventDefault();
			shortcut();
		}
	}
	
	document.addEventListener('keydown', handleKeyDown);
	
	return {
		register: (key: string, callback: () => void) => {
			shortcuts.set(key, callback);
		},
		unregister: (key: string) => {
			shortcuts.delete(key);
		},
		destroy: () => {
			document.removeEventListener('keydown', handleKeyDown);
		}
	};
}

// ARIA live region for announcements
export function createLiveRegion(politeness: 'polite' | 'assertive' = 'polite') {
	const region = document.createElement('div');
	region.setAttribute('aria-live', politeness);
	region.setAttribute('aria-atomic', 'true');
	region.className = 'sr-only';
	document.body.appendChild(region);
	
	return {
		announce: (message: string) => {
			region.textContent = message;
		},
		destroy: () => {
			document.body.removeChild(region);
		}
	};
}
