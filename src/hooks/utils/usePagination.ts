import { useState, useMemo, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  totalCount?: number;
}

interface UsePaginationState {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

interface UsePaginationActions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  reset: () => void;
}

export interface UsePaginationReturn {
  state: UsePaginationState;
  actions: UsePaginationActions;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 20,
  totalCount = 0,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit - 1, totalCount - 1);

  const goToNextPage = useCallback(() => {
    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  const handleSetPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(totalPages, newPage));
    setPage(validPage);
  }, [totalPages]);

  const handleSetLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const state = useMemo(() => ({
    page,
    limit,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
  }), [page, limit, totalPages, totalCount, hasNextPage, hasPreviousPage, startIndex, endIndex]);

  const actions = useMemo(() => ({
    setPage: handleSetPage,
    setLimit: handleSetLimit,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    reset,
  }), [handleSetPage, handleSetLimit, goToNextPage, goToPreviousPage, goToFirstPage, goToLastPage, reset]);

  return {
    state,
    actions,
  };
}
