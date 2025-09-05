import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, APIError } from './api';
import { mockFetch, setupMocks, cleanupMocks } from '../test/utils';

// Setup mocks
setupMocks();

describe('API Client', () => {
	beforeEach(() => {
		cleanupMocks();
	});

	afterEach(() => {
		cleanupMocks();
	});

	describe('healthCheck', () => {
		it('should return health status on success', async () => {
			const mockResponse = {
				success: true,
				data: { status: 'ok', version: '1.0.0' }
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse)
			});

			const result = await api.healthCheck();

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/health',
				expect.objectContaining({
					headers: { 'Content-Type': 'application/json' }
				})
			);
			expect(result).toEqual({ status: 'ok', version: '1.0.0' });
		});

		it('should throw APIError on HTTP error', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				json: () => Promise.resolve({ success: false, error: 'Server error' })
			});

			await expect(api.healthCheck()).rejects.toThrow(APIError);
		});

		it('should throw APIError on network error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network error'));

			await expect(api.healthCheck()).rejects.toThrow(APIError);
		});

		it('should throw APIError on timeout', async () => {
			mockFetch.mockRejectedValueOnce(new DOMException('The operation was aborted', 'AbortError'));

			await expect(api.healthCheck()).rejects.toThrow(APIError);
		});
	});

	describe('getAlgorithms', () => {
		it('should return algorithms on success', async () => {
			const mockAlgorithms = [
				{
					id: 'bubble-sort',
					name: 'Bubble Sort',
					description: 'A simple sorting algorithm',
					category: 'Sorting',
					time_complexity: 'O(n²)',
					space_complexity: 'O(1)'
				}
			];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: mockAlgorithms })
			});

			const result = await api.getAlgorithms();

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/algorithms',
				expect.any(Object)
			);
			expect(result).toEqual(mockAlgorithms);
		});
	});

	describe('getAlgorithm', () => {
		it('should return algorithm on success', async () => {
			const mockAlgorithm = {
				id: 'bubble-sort',
				name: 'Bubble Sort',
				description: 'A simple sorting algorithm',
				category: 'Sorting',
				time_complexity: 'O(n²)',
				space_complexity: 'O(1)'
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: mockAlgorithm })
			});

			const result = await api.getAlgorithm('bubble-sort');

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/algorithms/bubble-sort',
				expect.any(Object)
			);
			expect(result).toEqual(mockAlgorithm);
		});

		it('should throw APIError for invalid algorithm ID', async () => {
			await expect(api.getAlgorithm('')).rejects.toThrow(APIError);
			await expect(api.getAlgorithm('invalid-id!')).rejects.toThrow(APIError);
		});
	});

	describe('executeAlgorithm', () => {
		it('should execute algorithm successfully', async () => {
			const mockSteps = [
				{
					stepNumber: 1,
					action: 'compare',
					data: [5, 2, 8, 1, 9],
					highlights: [0, 1],
					metadata: { description: 'Comparing elements' },
					timestamp: new Date().toISOString()
				}
			];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve({ success: true, data: mockSteps })
			});

			const config = {
				array_size: 5,
				speed: 1,
				data: [5, 2, 8, 1, 9]
			};

			const result = await api.executeAlgorithm('bubble-sort', config);

			expect(mockFetch).toHaveBeenCalledWith(
				'http://localhost:8080/api/v1/algorithms/bubble-sort/execute',
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(config)
				})
			);
			expect(result).toEqual(mockSteps);
		});

		it('should throw APIError for invalid algorithm ID', async () => {
			const config = { array_size: 5, speed: 1 };

			await expect(api.executeAlgorithm('', config)).rejects.toThrow(APIError);
			await expect(api.executeAlgorithm('invalid-id!', config)).rejects.toThrow(APIError);
		});

		it('should throw APIError for invalid config', async () => {
			const invalidConfig = { array_size: -1, speed: 1 };

			await expect(api.executeAlgorithm('bubble-sort', invalidConfig)).rejects.toThrow(APIError);
		});
	});

	describe('APIError', () => {
		it('should create APIError with correct properties', () => {
			const error = new APIError('Test error', 400, { success: false, error: 'Test error' });

			expect(error.message).toBe('Test error');
			expect(error.status).toBe(400);
			expect(error.response).toEqual({ success: false, error: 'Test error' });
			expect(error.name).toBe('APIError');
		});
	});
});
