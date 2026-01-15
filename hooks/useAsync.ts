import { useState, useCallback, useRef, useEffect } from "react";

interface UseAsyncOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface AsyncState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Modern async state management hook
 * Handles loading states, errors, and data with proper cleanup
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { initialData, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false,
      isError: false,
    }));

    try {
      const data = await asyncFunction();

      if (mountedRef.current) {
        setState({
          data,
          isLoading: false,
          error: null,
          isSuccess: true,
          isError: false,
        });
        onSuccess?.(data);
      }

      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");

      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error,
          isSuccess: false,
          isError: true,
        }));
        onError?.(error);
      }

      throw error;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Debounce hook for search inputs and other rate-limited operations
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
