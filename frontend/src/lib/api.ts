import type { 
  Algorithm, 
  AlgorithmConfig, 
  AlgorithmStep, 
  APIResponse 
} from './types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

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

  try {
    const response = await fetch(url, config);
    const data: APIResponse<T> = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    if (!data.success) {
      throw new APIError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
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
    return request<{ status: string; version: string }>('/health');
  },

  // Algorithm endpoints
  async getAlgorithms(): Promise<Algorithm[]> {
    return request<Algorithm[]>('/algorithms');
  },

  async getAlgorithmsByType(type: string): Promise<Algorithm[]> {
    return request<Algorithm[]>(`/algorithms/type/${type}`);
  },

  async getAlgorithm(id: string): Promise<Algorithm> {
    return request<Algorithm>(`/algorithms/${id}`);
  },

  async getAlgorithmConfig(id: string): Promise<AlgorithmConfig> {
    return request<AlgorithmConfig>(`/algorithms/${id}/config`);
  },

  async executeAlgorithm(id: string, config: AlgorithmConfig): Promise<AlgorithmStep[]> {
    return request<AlgorithmStep[]>(`/algorithms/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },
};

export { APIError };
