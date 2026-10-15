import apiClient from './api.js';

/**
 * Service to ping backend health endpoint
 * @returns {Promise<{ data: any, latencyMs: number }>}
 */
export const checkBackendHealth = async () => {
  const startTime = performance.now();
  const response = await apiClient.get('/health');
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    data: response.data,
    latencyMs
  };
};

