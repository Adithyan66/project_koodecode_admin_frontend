import { useState, useCallback, useMemo } from 'react';

export type FilterValue = string | number | boolean;

export interface UseFiltersReturn<T extends Record<string, FilterValue>> {
  state: T;
  actions: {
    setFilter: <K extends keyof T>(key: K, value: T[K]) => void;
    setFilters: (filters: Partial<T>) => void;
    clearFilters: () => void;
    resetToDefaults: () => void;
  };
}

interface UseFiltersProps<T extends Record<string, FilterValue>> {
  initialFilters: T;
  onFilterChange?: () => void;
}

/**
 * Generic hook for managing filters state
 * @example
 * const filters = useFilters({
 *   initialFilters: { search: '', difficulty: '', status: '' },
 *   onFilterChange: () => pagination.actions.setPage(1)
 * });
 */
export function useFilters<T extends Record<string, FilterValue>>({
  initialFilters,
  onFilterChange,
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
    onFilterChange?.();
  }, [onFilterChange]);

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    onFilterChange?.();
  }, [onFilterChange]);

  const clearFilters = useCallback(() => {
    const clearedFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key as keyof T] = '' as T[keyof T];
      return acc;
    }, {} as T);
    setFiltersState(clearedFilters);
    onFilterChange?.();
  }, [filters, onFilterChange]);

  const resetToDefaults = useCallback(() => {
    setFiltersState(initialFilters);
    onFilterChange?.();
  }, [initialFilters, onFilterChange]);

  const state = useMemo(() => filters, [filters]);

  const actions = useMemo(() => ({
    setFilter,
    setFilters,
    clearFilters,
    resetToDefaults,
  }), [setFilter, setFilters, clearFilters, resetToDefaults]);

  return {
    state,
    actions,
  };
}
