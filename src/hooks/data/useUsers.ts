import { useState, useEffect } from 'react';
import { fetchUsers, type UsersQuery } from '../../api/users';
import type { User } from '../../types/user';
import { usePagination } from '../utils/usePagination';
import { useSorting } from '../utils/useSorting';
import { imageKitService } from '../../services/ImageKitService';

interface UseUsersResult {
	users: User[];
	loading: boolean;
	error: string | null;
	pagination: ReturnType<typeof usePagination>['state'];
	paginationActions: ReturnType<typeof usePagination>['actions'];
	sortBy: string;
	sortOrder: 'asc' | 'desc';
	handleSort: (column: string) => void;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	refetch: () => Promise<void>;
}

export function useUsers(): UseUsersResult {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [totalCount, setTotalCount] = useState(0);

	const { state: paginationBase, actions: paginationActions } = usePagination({
		initialPage: 1,
		initialLimit: 10,
		totalCount,
	});

	// Add totalCount to pagination state
	const pagination = {
		...paginationBase,
		totalCount,
	};

	const { state: sortingState, actions: sortingActions } = useSorting<string>({
		initialSortBy: 'createdAt',
		initialSortOrder: 'desc',
	});

	const { sortBy, sortOrder } = sortingState;
	const { handleSort } = sortingActions;

	const fetchUsersData = async () => {
		setLoading(true);
		setError(null);

		try {
			const params: UsersQuery = {
				page: pagination.page,
				limit: pagination.limit,
				...(debouncedSearchQuery && { search: debouncedSearchQuery }),
			};

			const response = await fetchUsers(params);
			const enhancedUsers = response.data.users.map((user) => {
				const getAvatarUrl = () => {
					if (user.profilePicKey) {
						return imageKitService.getAvatarUrl(user.profilePicKey, 48);
					}

					if (user.profilePicUrl) {
						return user.profilePicUrl.startsWith('http')
							? user.profilePicUrl
							: imageKitService.getAvatarUrl(user.profilePicUrl, 48);
					}

					return undefined;
				};

				return {
					...user,
					avatarUrl: getAvatarUrl(),
				};
			});
			setUsers(enhancedUsers);
			setTotalCount(response.data.pagination.total);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch users');
			setUsers([]);
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

	useEffect(() => {
		fetchUsersData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pagination.page, pagination.limit, debouncedSearchQuery]);

	return {
		users,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		refetch: fetchUsersData,
	};
}
