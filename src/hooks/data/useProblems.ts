import { useState, useEffect, useMemo } from 'react';
import { fetchProblems } from '../../api/problems';
import type { ProblemsQuery, ProblemListItem, ProblemsSortBy, SortOrder, Difficulty, ProblemStatus } from '../../types/problem';
import { useGlobalLoading } from '../ui/useGlobalLoading';

interface UseProblemsState {
  items: ProblemListItem[];
  totalCount: number;
  error: string | null;
  loading: boolean;
}

interface UseProblemsActions {
  refetch: () => void;
  setError: (error: string | null) => void;
}

interface UseProblemsFilters {
  search: string;
  difficulty: '' | Difficulty;
  status: '' | ProblemStatus;
  setSearch: (search: string) => void;
  setDifficulty: (difficulty: '' | Difficulty) => void;
  setStatus: (status: '' | ProblemStatus) => void;
}

interface UseProblemsPagination {
  page: number;
  limit: number;
  totalPages: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

interface UseProblemsSorting {
  sortBy: ProblemsSortBy;
  sortOrder: SortOrder;
  handleSort: (column: string) => void;
}

export interface UseProblemsReturn {
  state: UseProblemsState;
  actions: UseProblemsActions;
  filters: UseProblemsFilters;
  pagination: UseProblemsPagination;
  sorting: UseProblemsSorting;
  query: ProblemsQuery;
}

export function useProblems(): UseProblemsReturn {
  const [items, setItems] = useState<ProblemListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<ProblemsSortBy>('problemNumber');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'' | Difficulty>('');
  const [status, setStatus] = useState<'' | ProblemStatus>('');

  const { showLoading, hideLoading } = useGlobalLoading();

  const query = useMemo<ProblemsQuery>(
    () => ({ search, difficulty, status, page, limit, sortBy, sortOrder }),
    [search, difficulty, status, page, limit, sortBy, sortOrder],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const fetchData = async () => {
    let active = true;
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
      if (active) hideLoading();
    }

    return () => {
      active = false;
    };
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  const handleSort = (column: string) => {
    const col = column as ProblemsSortBy;
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  };

  const goToNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  const goToPreviousPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const refetch = () => {
    fetchData();
  };

  return {
    state: {
      items,
      totalCount,
      error,
      loading: false, // This will be managed by global loading
    },
    actions: {
      refetch,
      setError,
    },
    filters: {
      search,
      difficulty,
      status,
      setSearch: (value) => {
        setPage(1);
        setSearch(value);
      },
      setDifficulty: (value) => {
        setPage(1);
        setDifficulty(value);
      },
      setStatus: (value) => {
        setPage(1);
        setStatus(value);
      },
    },
    pagination: {
      page,
      limit,
      totalPages,
      setPage,
      setLimit: (value) => {
        setPage(1);
        setLimit(value);
      },
      goToNextPage,
      goToPreviousPage,
    },
    sorting: {
      sortBy,
      sortOrder,
      handleSort,
    },
    query,
  };
}
