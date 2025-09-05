import type { 
  Algorithm, 
  AlgorithmConfig, 
  AlgorithmStep, 
  APIResponse 
} from './types';
import { validateAlgorithmConfig, validateAlgorithmId } from './utils/validation';
import { SecureAPIClient, apiRateLimiter } from './utils/security';
import { API_CONFIG } from './constants';

const API_BASE_URL = API_CONFIG.BASE_URL;
const REQUEST_TIMEOUT = API_CONFIG.TIMEOUT;
const secureClient = new SecureAPIClient(API_BASE_URL);

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: APIResponse
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Check if response is ok
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData: any = null;

      try {
        const data: APIResponse<T> = await response.json();
        errorMessage = data.error || errorMessage;
        errorData = data;
      } catch {
        // If JSON parsing fails, use the default error message
      }

      throw new APIError(errorMessage, response.status, errorData);
    }

    const data: APIResponse<T> = await response.json();

    if (!data.success) {
      throw new APIError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }

    return data.data as T;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new APIError('Request timeout', 408);
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    return request<{ status: string; version: string }>(API_CONFIG.ENDPOINTS.HEALTH);
  },

  // Algorithm endpoints
  async getAlgorithms(): Promise<Algorithm[]> {
    // Check rate limit
    if (!apiRateLimiter.isAllowed('get-algorithms')) {
      throw new APIError('Rate limit exceeded', 429);
    }

    return request<Algorithm[]>(API_CONFIG.ENDPOINTS.ALGORITHMS);
  },

  async getAlgorithmsByType(type: string): Promise<Algorithm[]> {
    return request<Algorithm[]>(`/algorithms/type/${type}`);
  },

  async getAlgorithm(id: string): Promise<Algorithm> {
    // Validate algorithm ID
    const validation = validateAlgorithmId(id);
    if (!validation.isValid) {
      throw new APIError(`Invalid algorithm ID: ${validation.errors.join(', ')}`, 400);
    }
    
    return request<Algorithm>(API_CONFIG.ENDPOINTS.ALGORITHM_BY_ID(id));
  },

  async getAlgorithmConfig(id: string): Promise<AlgorithmConfig> {
    // Validate algorithm ID
    const validation = validateAlgorithmId(id);
    if (!validation.isValid) {
      throw new APIError(`Invalid algorithm ID: ${validation.errors.join(', ')}`, 400);
    }
    
    return request<AlgorithmConfig>(API_CONFIG.ENDPOINTS.ALGORITHM_CONFIG(id));
  },

  async executeAlgorithm(id: string, config: AlgorithmConfig): Promise<AlgorithmStep[]> {
    // Validate algorithm ID
    const idValidation = validateAlgorithmId(id);
    if (!idValidation.isValid) {
      throw new APIError(`Invalid algorithm ID: ${idValidation.errors.join(', ')}`, 400);
    }
    
    // Validate configuration
    const configValidation = validateAlgorithmConfig(config);
    if (!configValidation.isValid) {
      throw new APIError(`Invalid configuration: ${configValidation.errors.join(', ')}`, 400);
    }
    
    return request<AlgorithmStep[]>(API_CONFIG.ENDPOINTS.EXECUTE_ALGORITHM(id), {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },
};

export { APIError };
