import { useState, useEffect, useCallback, useRef } from 'react';
import { checkBackendHealth } from '../services/healthService.js';

/**
 * Custom React Hook for monitoring backend & database health
 * Demonstrates: useState, useEffect, useRef, useCallback
 */
export const useHealthCheck = (autoCheck = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // useRef to track how many times health check has executed
  const checkCountRef = useRef(0);
  // useRef to avoid updating state if component unmounts during async call
  const isMountedRef = useRef(true);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    checkCountRef.current += 1;

    try {
      const result = await checkBackendHealth();
      if (isMountedRef.current) {
        setData(result.data.data);
        setLatency(result.latencyMs);
        setLastChecked(new Date());
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
        setData(null);
        setLatency(null);
        setLastChecked(new Date());
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (autoCheck) {
      fetchHealth();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [autoCheck, fetchHealth]);

  return {
    data,
    loading,
    error,
    latency,
    lastChecked,
    checkCount: checkCountRef.current,
    refetch: fetchHealth
  };
};

