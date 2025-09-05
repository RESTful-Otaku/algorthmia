import { writable, derived, get } from 'svelte/store';
import type { 
  AppState, 
  Algorithm, 
  AlgorithmExecution, 
  ControlState, 
  SidePanelState, 
  Notification,
  Theme 
} from '../types';

// Theme store
export const theme = writable<Theme>('light');

// Algorithms store
export const algorithms = writable<Algorithm[]>([]);

// Selected algorithm store
export const selectedAlgorithm = writable<Algorithm | null>(null);

// Execution store
export const execution = writable<AlgorithmExecution | null>(null);

// Control state store
export const controlState = writable<ControlState>({
  isPlaying: false,
  isPaused: false,
  currentStep: 0,
  totalSteps: 0,
  speed: 500, // 500ms delay between steps
  isGenerating: false,
});

// Side panel state store
export const sidePanelState = writable<SidePanelState>({
  isOpen: false,
  selectedAlgorithm: null,
  searchQuery: '',
  showConfig: false,
});

// Notifications store
export const notifications = writable<Notification[]>([]);

// Loading state store
export const isLoading = writable<boolean>(false);

// Error store
export const error = writable<string | null>(null);

// Derived app state
export const appState = derived(
  [
    theme,
    algorithms,
    selectedAlgorithm,
    execution,
    controlState,
    sidePanelState,
    notifications,
    isLoading,
    error
  ],
  ([
    $theme,
    $algorithms,
    $selectedAlgorithm,
    $execution,
    $controlState,
    $sidePanelState,
    $notifications,
    $isLoading,
    $error
  ]) => ({
    theme: $theme,
    algorithms: $algorithms,
    selectedAlgorithm: $selectedAlgorithm,
    execution: $execution,
    controlState: $controlState,
    sidePanelState: $sidePanelState,
    notifications: $notifications,
    isLoading: $isLoading,
    error: $error,
  })
);

// Theme actions
export const toggleTheme = () => {
  theme.update(current => current === 'light' ? 'dark' : 'light');
};

export const setTheme = (newTheme: Theme) => {
  theme.set(newTheme);
};

// Algorithm actions
export const setAlgorithms = (newAlgorithms: Algorithm[]) => {
  algorithms.set(newAlgorithms);
};

export const selectAlgorithm = (algorithm: Algorithm | null) => {
  selectedAlgorithm.set(algorithm);
  sidePanelState.update(state => ({
    ...state,
    selectedAlgorithm: algorithm,
    showConfig: algorithm !== null,
  }));
};

// Control actions
export const play = () => {
  controlState.update(state => ({
    ...state,
    isPlaying: true,
    isPaused: false,
  }));
};

export const pause = () => {
  controlState.update(state => ({
    ...state,
    isPlaying: false,
    isPaused: true,
  }));
};

export const stop = () => {
  controlState.update(state => ({
    ...state,
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
  }));
  execution.set(null);
};

export const setCurrentStep = (step: number) => {
  controlState.update(state => ({
    ...state,
    currentStep: Math.max(0, Math.min(step, state.totalSteps - 1)),
  }));
};

export const setSpeed = (speed: number) => {
  controlState.update(state => ({
    ...state,
    speed: Math.max(1, Math.min(10, speed)),
  }));
};

export const setTotalSteps = (total: number) => {
  controlState.update(state => ({
    ...state,
    totalSteps: total,
    currentStep: Math.min(state.currentStep, total - 1),
  }));
};

export const setGenerating = (generating: boolean) => {
  controlState.update(state => ({
    ...state,
    isGenerating: generating,
  }));
};

// Side panel actions
export const toggleSidePanel = () => {
  sidePanelState.update(state => ({
    ...state,
    isOpen: !state.isOpen,
  }));
};

export const setSidePanelOpen = (isOpen: boolean) => {
  sidePanelState.update(state => ({
    ...state,
    isOpen,
  }));
};

export const setSearchQuery = (query: string) => {
  sidePanelState.update(state => ({
    ...state,
    searchQuery: query,
  }));
};

export const toggleConfig = () => {
  sidePanelState.update(state => ({
    ...state,
    showConfig: !state.showConfig,
  }));
};

// Notification actions
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const newNotification: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  
  notifications.update(current => [...current, newNotification]);
  
  // Auto-remove after duration
  if (notification.duration > 0) {
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, notification.duration);
  }
};

export const removeNotification = (id: string) => {
  notifications.update(current => current.filter(n => n.id !== id));
};

export const clearNotifications = () => {
  notifications.set([]);
};

// Loading actions
export const setLoading = (loading: boolean) => {
  isLoading.set(loading);
};

// Error actions
export const setError = (errorMessage: string | null) => {
  error.set(errorMessage);
};

export const showError = (title: string, message: string, duration: number = 10000) => {
  addNotification({
    type: 'error',
    title,
    message,
    duration
  });
};

export const showSuccess = (title: string, message: string, duration: number = 6000) => {
  addNotification({
    type: 'success',
    title,
    message,
    duration
  });
};

export const showWarning = (title: string, message: string, duration: number = 8000) => {
  addNotification({
    type: 'warning',
    title,
    message,
    duration
  });
};

export const showInfo = (title: string, message: string, duration: number = 6000) => {
  addNotification({
    type: 'info',
    title,
    message,
    duration
  });
};

// Execution actions
export const setExecution = (newExecution: AlgorithmExecution | null) => {
  execution.set(newExecution);
  if (newExecution) {
    setTotalSteps(newExecution.steps.length);
    setCurrentStep(0);
  }
};

// Utility functions
export const resetApp = () => {
  selectedAlgorithm.set(null);
  execution.set(null);
  controlState.set({
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 0,
    speed: 500, // 500ms delay between steps
    isGenerating: false,
  });
  sidePanelState.set({
    isOpen: false,
    selectedAlgorithm: null,
    searchQuery: '',
    showConfig: false,
  });
  notifications.set([]);
  isLoading.set(false);
  error.set(null);
};

// Computed values
export const filteredAlgorithms = derived(
  algorithms,
  ($algorithms) => $algorithms
);

export const currentStep = derived(
  [execution, controlState],
  ([$execution, $controlState]) => {
    if (!$execution || $execution.steps.length === 0) {
      return null;
    }
    return $execution.steps[$controlState.currentStep] || null;
  }
);

export const isAtStart = derived(
  controlState,
  ($controlState) => $controlState.currentStep === 0
);

export const isAtEnd = derived(
  [controlState, execution],
  ([$controlState, $execution]) => 
    $controlState.currentStep >= ($execution?.steps.length || 1) - 1
);
