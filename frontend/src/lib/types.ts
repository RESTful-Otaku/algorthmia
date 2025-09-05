// Algorithm types
export type AlgorithmType = 'sorting' | 'search' | 'graph';

export interface Algorithm {
  id: string;
  name: string;
  type: AlgorithmType;
  description: string;
  time_complexity: string;
  space_complexity: string;
  category: string;
  enabled: boolean;
}

export interface AlgorithmStep {
  step_number: number;
  action: string;
  data: number[];
  highlights: number[];
  metadata: Record<string, any>;
  timestamp: string;
}

export interface AlgorithmConfig {
  array_size: number;
  speed: number;
  data?: number[];
  custom_params?: Record<string, any>;
}

export interface AlgorithmExecution {
  id: string;
  algorithm_id: string;
  steps: AlgorithmStep[];
  current_step: number;
  is_running: boolean;
  is_paused: boolean;
  is_complete: boolean;
  start_time: string;
  end_time?: string;
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration: number;
  timestamp: string;
}

// Theme types
export type Theme = 'light' | 'dark';

// Visualization types
export interface VisualizationData {
  type: string;
  data: number[];
  highlights: number[];
  metadata: Record<string, any>;
  step_number: number;
  is_complete: boolean;
}

// Control panel types
export interface ControlState {
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  isGenerating: boolean;
}

// Side panel types
export interface SidePanelState {
  isOpen: boolean;
  selectedAlgorithm: Algorithm | null;
  searchQuery: string;
  showConfig: boolean;
}

// App state types
export interface AppState {
  theme: Theme;
  algorithms: Algorithm[];
  selectedAlgorithm: Algorithm | null;
  execution: AlgorithmExecution | null;
  controlState: ControlState;
  sidePanelState: SidePanelState;
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

// Event types
export interface AlgorithmSelectEvent {
  algorithm: Algorithm;
}

export interface ConfigChangeEvent {
  config: AlgorithmConfig;
}

export interface StepChangeEvent {
  step: number;
}

export interface SpeedChangeEvent {
  speed: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Component prop types
export interface BaseComponentProps {
  class?: string;
  id?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: string | number) => void;
}

export interface SelectProps extends BaseComponentProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export interface SliderProps extends BaseComponentProps {
  min: number;
  max: number;
  value: number;
  step?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: any[];
  hover?: boolean;
  onClick?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface StepAnimation {
  type: 'highlight' | 'swap' | 'compare' | 'move';
  indices: number[];
  duration: number;
  delay?: number;
}
