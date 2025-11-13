import { useCallback, useEffect, useState } from 'react';
import {
	fetchNotificationSubscribers,
	type NotificationSubscribersQuery,
} from '../../api/notifications';
import type { NotificationSubscriber } from '../../types/notifications';
import { usePagination } from '../utils/usePagination';

interface UseNotificationSubscribersResult {
	subscribers: NotificationSubscriber[];
	loading: boolean;
	error: string | null;
	pagination: ReturnType<typeof usePagination>['state'];
	paginationActions: ReturnType<typeof usePagination>['actions'];
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	osFilter: string;
	setOsFilter: (value: string) => void;
	refetch: () => Promise<void>;
}

const SEARCH_DEBOUNCE_MS = 400;

export function useNotificationSubscribers(): UseNotificationSubscribersResult {
	const [subscribers, setSubscribers] = useState<NotificationSubscriber[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [osFilter, setOsFilter] = useState('');

	const { state: paginationStateBase, actions: paginationActions } = usePagination({
		initialLimit: 20,
		totalCount,
	});

	const pagination = {
		...paginationStateBase,
		totalCount,
	};

	const loadSubscribers = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const params: NotificationSubscribersQuery = {
				page: pagination.page,
				limit: pagination.limit,
				...(debouncedSearchQuery && { search: debouncedSearchQuery }),
				...(osFilter && { os: osFilter }),
			};

			const { items, meta } = await fetchNotificationSubscribers(params);

			setSubscribers(items);
			setTotalCount(meta.total);

			if (meta.totalPages !== pagination.totalPages) {
				// ensure pagination derived values stay in sync when total changes
				paginationActions.setPage(Math.min(meta.page, Math.max(1, meta.totalPages)));
			}
		} catch (err: any) {
			const message =
				err?.response?.data?.message ||
				err?.message ||
				'Failed to fetch notification subscribers';
			setError(message);
			setSubscribers([]);
		} finally {
			setLoading(false);
		}
	}, [
		debouncedSearchQuery,
		osFilter,
		pagination.page,
		pagination.limit,
		pagination.totalPages,
		paginationActions,
	]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery.trim());
		}, SEARCH_DEBOUNCE_MS);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		paginationActions.setPage(1);
	}, [debouncedSearchQuery, osFilter, paginationActions]);

	useEffect(() => {
		void loadSubscribers();
	}, [loadSubscribers]);

	return {
		subscribers,
		loading,
		error,
		pagination,
		paginationActions,
		searchQuery,
		setSearchQuery,
		osFilter,
		setOsFilter,
		refetch: loadSubscribers,
	};
}


