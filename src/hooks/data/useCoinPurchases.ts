import { useState, useEffect } from 'react';
import { fetchCoinPurchases } from '../../api/coinPurchases';
import type { CoinPurchase, CoinPurchasesStats, CoinPurchasesQuery } from '../../types/coinPurchase';
import { usePagination } from '../utils/usePagination';
import { useSorting } from '../utils/useSorting';

interface UseCoinPurchasesResult {
	purchases: CoinPurchase[];
	stats: CoinPurchasesStats | null;
	loading: boolean;
	error: string | null;
	pagination: ReturnType<typeof usePagination>['state'];
	paginationActions: ReturnType<typeof usePagination>['actions'];
	sortBy: string;
	sortOrder: 'asc' | 'desc';
	handleSort: (column: string) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	paymentMethodFilter: string;
	setPaymentMethodFilter: (method: string) => void;
	dateRangeFilter: string;
	setDateRangeFilter: (range: string) => void;
	startDate: string;
	setStartDate: (date: string) => void;
	endDate: string;
	setEndDate: (date: string) => void;
	refetch: () => Promise<void>;
}

export function useCoinPurchases(): UseCoinPurchasesResult {
	const [purchases, setPurchases] = useState<CoinPurchase[]>([]);
	const [stats, setStats] = useState<CoinPurchasesStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [totalCount, setTotalCount] = useState(0);

	// Filter states
	const [statusFilter, setStatusFilter] = useState('');
	const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
	const [dateRangeFilter, setDateRangeFilter] = useState('this_month');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	const { state: paginationBase, actions: paginationActions } = usePagination({
		initialPage: 1,
		initialLimit: 20,
		totalCount,
	});

	const pagination = {
		...paginationBase,
		totalCount,
	};

	const { state: sortingState, actions: sortingActions } = useSorting({
		initialSortBy: 'createdAt',
		initialSortOrder: 'desc',
	});

	const { sortBy, sortOrder } = sortingState;
	const handleSort = sortingActions.handleSort as (column: string) => void;

	const fetchPurchasesData = async () => {
		setLoading(true);
		setError(null);

		try {
			const params: CoinPurchasesQuery = {
				page: pagination.page,
				limit: pagination.limit,
				...(debouncedSearchQuery && { search: debouncedSearchQuery }),
				...(statusFilter && { status: statusFilter as any }),
				...(paymentMethodFilter && { paymentMethod: paymentMethodFilter as any }),
				...(dateRangeFilter && { dateRange: dateRangeFilter as any }),
				...(dateRangeFilter === 'custom' && startDate && { startDate }),
				...(dateRangeFilter === 'custom' && endDate && { endDate }),
				sortBy,
				sortOrder,
			};

			const response = await fetchCoinPurchases(params);
			setPurchases(response.data.purchases);
			setStats(response.data.stats);
			setTotalCount(response.data.pagination.total);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch coin purchases');
			setPurchases([]);
		} finally {
			setLoading(false);
		}
	};

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Reset to page 1 when search query changes
	useEffect(() => {
		if (pagination.page !== 1) {
			paginationActions.setPage(1);
		}
	}, [debouncedSearchQuery]);

	// Fetch data when dependencies change
	useEffect(() => {
		// Skip API call if custom date range is selected but dates are incomplete
		const isCustomDateRangeIncomplete = dateRangeFilter === 'custom' && (!startDate || !endDate);
		
		if (isCustomDateRangeIncomplete) {
			return;
		}
		
		fetchPurchasesData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		pagination.page,
		pagination.limit,
		debouncedSearchQuery,
		statusFilter,
		paymentMethodFilter,
		dateRangeFilter,
		startDate,
		endDate,
		sortBy,
		sortOrder,
	]);

	return {
		purchases,
		stats,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		paymentMethodFilter,
		setPaymentMethodFilter,
		dateRangeFilter,
		setDateRangeFilter,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		refetch: fetchPurchasesData,
	};
}

