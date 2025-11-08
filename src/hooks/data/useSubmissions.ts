import { useState, useEffect } from 'react';
import { fetchSubmissions } from '../../api/submissions';
import type { Submission, SubmissionSummary, SubmissionsQuery } from '../../types/submission';
import { usePagination } from '../utils/usePagination';
import { useSorting } from '../utils/useSorting';

interface UseSubmissionsResult {
	submissions: Submission[];
	summary: SubmissionSummary | null;
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
	submissionTypeFilter: string;
	setSubmissionTypeFilter: (type: string) => void;
	dateRangeFilter: string;
	setDateRangeFilter: (range: string) => void;
	startDate: string;
	setStartDate: (date: string) => void;
	endDate: string;
	setEndDate: (date: string) => void;
	refetch: () => Promise<void>;
}

export function useSubmissions(): UseSubmissionsResult {
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [summary, setSummary] = useState<SubmissionSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [totalCount, setTotalCount] = useState(0);

	const [statusFilter, setStatusFilter] = useState('');
	const [submissionTypeFilter, setSubmissionTypeFilter] = useState('');
	const [dateRangeFilter, setDateRangeFilter] = useState('all');
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
	const { handleSort } = sortingActions;

	const getDateRange = () => {
		if (dateRangeFilter === 'custom') {
			return {
				startDate: startDate ? new Date(startDate).toISOString() : undefined,
				endDate: endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
			};
		}
		if (dateRangeFilter === 'this_month') {
			const now = new Date();
			const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
			return {
				startDate: firstDay.toISOString(),
				endDate: now.toISOString(),
			};
		}
		if (dateRangeFilter === 'last_month') {
			const now = new Date();
			const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
			return {
				startDate: firstDayLastMonth.toISOString(),
				endDate: lastDayLastMonth.toISOString(),
			};
		}
		return {};
	};

	const fetchSubmissionsData = async () => {
		setLoading(true);
		setError(null);

		try {
			const dateRange = getDateRange();
			const params: SubmissionsQuery = {
				page: pagination.page,
				limit: pagination.limit,
				...(debouncedSearchQuery && { search: debouncedSearchQuery }),
				...(statusFilter && { status: statusFilter }),
				...(submissionTypeFilter && { submissionType: submissionTypeFilter }),
				...(dateRange.startDate && { startDate: dateRange.startDate }),
				...(dateRange.endDate && { endDate: dateRange.endDate }),
				sortBy: sortBy as any,
				sortOrder,
			};

			const response = await fetchSubmissions(params);
			setSubmissions(response.data.submissions);
			setSummary(response.data.summary);
			setTotalCount(response.data.pagination.totalCount);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch submissions');
			setSubmissions([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		if (pagination.page !== 1) {
			paginationActions.setPage(1);
		}
	}, [debouncedSearchQuery]);

	useEffect(() => {
		const isCustomDateRangeIncomplete = dateRangeFilter === 'custom' && (!startDate || !endDate);
		
		if (isCustomDateRangeIncomplete) {
			return;
		}
		
		fetchSubmissionsData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		pagination.page,
		pagination.limit,
		debouncedSearchQuery,
		statusFilter,
		submissionTypeFilter,
		dateRangeFilter,
		startDate,
		endDate,
		sortBy,
		sortOrder,
	]);

	return {
		submissions,
		summary,
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
		submissionTypeFilter,
		setSubmissionTypeFilter,
		dateRangeFilter,
		setDateRangeFilter,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		refetch: fetchSubmissionsData,
	};
}

