import { useState, useEffect, useMemo } from 'react';
import { fetchActiveContests, fetchUpcomingContests, fetchPastContests, deleteContest, fetchContestById, updateContest } from '../../api/contests';
import type { 
  Contest, 
  ContestQuery, 
  ContestPagination 
} from '../../types/contest';
import { useGlobalLoading } from '../ui/useGlobalLoading';
import toast from 'react-hot-toast';

interface UseContestState {
  activeContests: Contest[];
  upcomingContests: Contest[];
  pastContests: Contest[];
  selectedContest: Contest | null;
  error: string | null;
  loading: boolean;
}

interface UseContestActions {
  refetch: () => void;
  setError: (error: string | null) => void;
  setSelectedContest: (contest: Contest | null) => void;
  deleteContestById: (contestId: string) => Promise<void>;
  getContestById: (contestId: string) => Promise<Contest>;
  updateContestById: (contestId: string, contestData: any) => Promise<void>;
}

interface UsePastContestsPagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

interface UsePastContestsFilters {
  search: string;
  setSearch: (search: string) => void;
}

export interface UseContestReturn {
  state: UseContestState;
  actions: UseContestActions;
  pastContestsPagination: UsePastContestsPagination;
  pastContestsFilters: UsePastContestsFilters;
  query: ContestQuery;
}

export function useContest(): UseContestReturn {
  const [activeContests, setActiveContests] = useState<Contest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [pastContests, setPastContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const { showLoading, hideLoading } = useGlobalLoading();

  const query = useMemo<ContestQuery>(
    () => ({ page, limit, search, state: 'ENDED' }),
    [page, limit, search],
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchData = async () => {
    let active = true;
    showLoading('Loading contests...');
    setError(null);
    
    try {
      // Fetch all three types of contests in parallel
      const [activeResponse, upcomingResponse, pastResponse] = await Promise.all([
        fetchActiveContests(),
        fetchUpcomingContests(),
        fetchPastContests(query)
      ]);

      if (!active) return;

      setActiveContests(activeResponse.data.contests);
      setUpcomingContests(upcomingResponse.data.contests);
      setPastContests(pastResponse.data.contests);
      setTotal(pastResponse.data.pagination.total);

      // Set the first past contest as selected by default
      if (pastResponse.data.contests.length > 0 && !selectedContest) {
        setSelectedContest(pastResponse.data.contests[0]);
      }
    } catch (err: any) {
      if (!active) return;
      setError(err?.response?.data?.message || err?.message || 'Failed to load contests');
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

  const goToNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  const goToPreviousPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const refetch = () => {
    fetchData();
  };

  const deleteContestById = async (contestId: string) => {
    try {
      showLoading('Deleting contest...');
      await deleteContest(contestId);
      toast.success('Contest deleted successfully');
      // Refresh the data after deletion
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete contest');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const getContestById = async (contestId: string): Promise<Contest> => {
    try {
      showLoading('Loading contest details...');
      const response = await fetchContestById(contestId);
      return response.data.contest;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load contest details');
      throw error;
    } finally {
      hideLoading();
    }
  };

  const updateContestById = async (contestId: string, contestData: any) => {
    try {
      showLoading('Updating contest...');
      await updateContest(contestId, contestData);
      toast.success('Contest updated successfully');
      // Refresh the data after update
      await fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update contest');
      throw error;
    } finally {
      hideLoading();
    }
  };

  return {
    state: {
      activeContests,
      upcomingContests,
      pastContests,
      selectedContest,
      error,
      loading: false, // This will be managed by global loading
    },
    actions: {
      refetch,
      setError,
      setSelectedContest,
      deleteContestById,
      getContestById,
      updateContestById,
    },
    pastContestsPagination: {
      page,
      limit,
      totalPages,
      total,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      setPage,
      setLimit: (value) => {
        setPage(1);
        setLimit(value);
      },
      goToNextPage,
      goToPreviousPage,
    },
    pastContestsFilters: {
      search,
      setSearch: (value) => {
        setPage(1);
        setSearch(value);
      },
    },
    query,
  };
}
