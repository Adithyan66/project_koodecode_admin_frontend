import { useState, useEffect } from 'react';
import { fetchRooms } from '../../api/rooms';
import type { Room, RoomsQuery } from '../../types/room';
import { usePagination } from '../utils/usePagination';
import { useSorting } from '../utils/useSorting';

interface UseRoomsResult {
	rooms: Room[];
	loading: boolean;
	error: string | null;
	pagination: ReturnType<typeof usePagination>['state'];
	paginationActions: ReturnType<typeof usePagination>['actions'];
	sortBy: string;
	sortOrder: 'asc' | 'desc';
	handleSort: (column: string) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	isPrivateFilter: string;
	setIsPrivateFilter: (filter: string) => void;
	statusFilter: string;
	setStatusFilter: (status: string) => void;
	refetch: () => Promise<void>;
}

export function useRooms(): UseRoomsResult {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [totalCount, setTotalCount] = useState(0);

	const [isPrivateFilter, setIsPrivateFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState('');

	const { state: paginationBase, actions: paginationActions } = usePagination({
		initialPage: 1,
		initialLimit: 10,
		totalCount,
	});

	const pagination = {
		...paginationBase,
		totalCount,
	};

	const { state: sortingState, actions: sortingActions } = useSorting({
		initialSortBy: 'lastActivity',
		initialSortOrder: 'desc',
	});

	const { sortBy, sortOrder } = sortingState;
	const handleSort = sortingActions.handleSort as (column: string) => void;

	const fetchRoomsData = async () => {
		setLoading(true);
		setError(null);

		try {
			const params: RoomsQuery = {
				page: pagination.page,
				limit: pagination.limit,
				...(debouncedSearchQuery && { search: debouncedSearchQuery }),
				...(isPrivateFilter && { isPrivate: isPrivateFilter === 'true' }),
				...(statusFilter && { status: statusFilter as any }),
				sortBy,
				sortOrder,
			};

			const response = await fetchRooms(params);
			setRooms(response.data.rooms);
			setTotalCount(response.data.pagination.total);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch rooms');
			setRooms([]);
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
		fetchRoomsData();
	}, [
		pagination.page,
		pagination.limit,
		debouncedSearchQuery,
		isPrivateFilter,
		statusFilter,
		sortBy,
		sortOrder,
	]);

	return {
		rooms,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		isPrivateFilter,
		setIsPrivateFilter,
		statusFilter,
		setStatusFilter,
		refetch: fetchRoomsData,
	};
}

