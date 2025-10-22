import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProblems } from '../../api/problems';
import type { ProblemsQuery, ProblemListItem, ProblemsSortBy, Difficulty, ProblemStatus } from '../../types/problem';
import { useGlobalLoading } from '../ui/useGlobalLoading';
import { usePagination } from '../utils/usePagination';
import { useFilters } from '../utils/useFilters';
import { useSorting } from '../utils/useSorting';

// Define problem-specific filter type
interface ProblemFilters extends Record<string, string> {
  search: string;
  difficulty: '' | Difficulty;
  status: '' | ProblemStatus;
}

interface UseProblemsDataState {
  items: ProblemListItem[];
  totalCount: number;
  error: string | null;
  loading: boolean;
}

interface UseProblemsDataActions {
  refetch: () => void;
  setError: (error: string | null) => void;
}

export interface UseProblemsDataReturn {
  state: UseProblemsDataState;
  actions: UseProblemsDataActions;
  filters: {
    state: ProblemFilters;
    actions: {
      setFilter: <K extends keyof ProblemFilters>(key: K, value: ProblemFilters[K]) => void;
      setFilters: (filters: Partial<ProblemFilters>) => void;
      clearFilters: () => void;
      resetToDefaults: () => void;
    };
  };
  pagination: ReturnType<typeof usePagination>;
  sorting: {
    state: {
      sortBy: ProblemsSortBy;
      sortOrder: 'asc' | 'desc';
    };
    actions: {
      handleSort: (column: ProblemsSortBy) => void;
      setSortBy: (sortBy: ProblemsSortBy) => void;
      setSortOrder: (sortOrder: 'asc' | 'desc') => void;
      resetSorting: () => void;
    };
  };
  query: ProblemsQuery;
}

export function useProblemsData(): UseProblemsDataReturn {
  const [items, setItems] = useState<ProblemListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { showLoading, hideLoading } = useGlobalLoading();

  // Initialize hooks
  const pagination = usePagination({ initialPage: 1, initialLimit: 20, totalCount });
  const filters = useFilters<ProblemFilters>({
    initialFilters: {
      search: '',
      difficulty: '',
      status: '',
    },
    onFilterChange: () => pagination.actions.setPage(1),
  });
  const sorting = useSorting<ProblemsSortBy>({
    initialSortBy: 'problemNumber',
    initialSortOrder: 'asc',
  });

  // Create query object
  const query = useMemo<ProblemsQuery>(
    () => ({
      search: filters.state.search,
      difficulty: filters.state.difficulty,
      status: filters.state.status,
      page: pagination.state.page,
      limit: pagination.state.limit,
      sortBy: sorting.state.sortBy,
      sortOrder: sorting.state.sortOrder,
    }),
    [filters.state, pagination.state, sorting.state],
  );

  // Fetch data function
  const fetchData = useCallback(async () => {
    let active = true;
    setLoading(true);
    showLoading();
    setError(null);

    try {
      const res = await fetchProblems(query);
      if (!active) return;
      setItems(res.data.problems);
      setTotalCount(res.data.pagination.totalCount);
    } catch (err: any) {
      if (!active) return;
      setError(err?.response?.data?.message || err?.message || 'Failed to load problems');
    } finally {
      if (active) {
        setLoading(false);
        hideLoading();
      }
    }

    return () => {
      active = false;
    };
  }, [query, showLoading, hideLoading]);

  // Effect to fetch data when query changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const state = useMemo(() => ({
    items,
    totalCount,
    error,
    loading,
  }), [items, totalCount, error, loading]);

  const actions = useMemo(() => ({
    refetch,
    setError,
  }), [refetch, setError]);

  return {
    state,
    actions,
    filters,
    pagination,
    sorting,
    query,
  };
}
