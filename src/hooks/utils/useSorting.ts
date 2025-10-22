import { useState, useCallback, useMemo } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface UseSortingReturn<T extends string> {
  state: {
    sortBy: T;
    sortOrder: SortOrder;
  };
  actions: {
    handleSort: (column: T) => void;
    setSortBy: (sortBy: T) => void;
    setSortOrder: (sortOrder: SortOrder) => void;
    resetSorting: () => void;
  };
}

interface UseSortingProps<T extends string> {
  initialSortBy: T;
  initialSortOrder?: SortOrder;
  onSortChange?: () => void;
}

/**
 * Generic hook for managing sorting state
 * @example
 * const sorting = useSorting({
 *   initialSortBy: 'problemNumber',
 *   initialSortOrder: 'asc',
 *   onSortChange: () => console.log('sort changed')
 * });
 */
export function useSorting<T extends string>({
  initialSortBy,
  initialSortOrder = 'asc',
  onSortChange,
}: UseSortingProps<T>): UseSortingReturn<T> {
  const [sortBy, setSortBy] = useState<T>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);

  const handleSort = useCallback((column: T) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    onSortChange?.();
  }, [sortBy, sortOrder, onSortChange]);

  const handleSetSortBy = useCallback((newSortBy: T) => {
    setSortBy(newSortBy);
    onSortChange?.();
  }, [onSortChange]);

  const handleSetSortOrder = useCallback((newSortOrder: SortOrder) => {
    setSortOrder(newSortOrder);
    onSortChange?.();
  }, [onSortChange]);

  const resetSorting = useCallback(() => {
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
    onSortChange?.();
  }, [initialSortBy, initialSortOrder, onSortChange]);

  const state = useMemo(() => ({
    sortBy,
    sortOrder,
  }), [sortBy, sortOrder]);

  const actions = useMemo(() => ({
    handleSort,
    setSortBy: handleSetSortBy,
    setSortOrder: handleSetSortOrder,
    resetSorting,
  }), [handleSort, handleSetSortBy, handleSetSortOrder, resetSorting]);

  return {
    state,
    actions,
  };
}
