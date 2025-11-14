import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchBadges, fetchBadgeDetail, type BadgeQueryParams, updateBadgeStatus } from '../../api/badges';
import type { AdminBadge, BadgeCategory, BadgeRarity, BadgeType } from '../../types/badge';
import { usePagination } from '../utils/usePagination';
import { useSorting } from '../utils/useSorting';

export interface BadgeFilters {
	search: string;
	type: BadgeType | '';
	category: BadgeCategory | '';
	rarity: BadgeRarity | '';
	includeInactive: boolean;
}

export interface UseBadgesResult {
	badges: AdminBadge[];
	loading: boolean;
	error: string | null;
	pagination: ReturnType<typeof usePagination>['state'] & { totalCount: number };
	paginationActions: ReturnType<typeof usePagination>['actions'];
	sortBy: string;
	sortOrder: 'asc' | 'desc';
	handleSort: (column: string) => void;
	filters: BadgeFilters;
	setFilters: (updater: (prev: BadgeFilters) => BadgeFilters) => void;
	refetch: () => Promise<void>;
	toggleBadgeStatus: (badgeId: string, isActive: boolean) => Promise<void>;
	getBadgeById: (badgeId: string) => Promise<AdminBadge>;
}

const initialFilters: BadgeFilters = {
	search: '',
	type: '',
	category: '',
	rarity: '',
	includeInactive: false,
};

export function useBadges(): UseBadgesResult {
	const [badges, setBadges] = useState<AdminBadge[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFiltersState] = useState<BadgeFilters>(initialFilters);
	const [totalCount, setTotalCount] = useState(0);

	const { state: paginationState, actions: paginationActions } = usePagination({
		initialPage: 1,
		initialLimit: 20,
		totalCount,
	});

	const pagination = useMemo(
		() => ({
			...paginationState,
			totalCount,
		}),
		[paginationState, totalCount],
	);

	const { state: sortingState, actions: sortingActions } = useSorting({
		initialSortBy: 'createdAt',
		initialSortOrder: 'desc',
	});

	const queryParams = useMemo<BadgeQueryParams>(
		() => ({
			page: pagination.page,
			limit: pagination.limit,
			search: filters.search || undefined,
			types: filters.type || undefined,
			categories: filters.category || undefined,
			rarities: filters.rarity || undefined,
			includeInactive: filters.includeInactive,
			sortField: sortingState.sortBy as 'createdAt' | 'name',
			sortOrder: sortingState.sortOrder,
		}),
		[pagination.page, pagination.limit, filters.search, filters.type, filters.category, filters.rarity, filters.includeInactive, sortingState.sortBy, sortingState.sortOrder],
	);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetchBadges(queryParams);
			setBadges(response.data.items);
			setTotalCount(response.data.total);
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to fetch badges';
			setError(message);
			setBadges([]);
		} finally {
			setLoading(false);
		}
	}, [queryParams]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const setFilters = (updater: (prev: BadgeFilters) => BadgeFilters) => {
		setFiltersState((prev) => {
			return updater(prev);
		});
		if (pagination.page !== 1) {
			paginationActions.setPage(1);
		}
	};

	const toggleBadgeStatus = async (badgeId: string, isActive: boolean) => {
		try {
			await updateBadgeStatus(badgeId, isActive);
			setBadges((prev) =>
				prev.map((badge) => (badge.id === badgeId ? { ...badge, isActive } : badge)),
			);
			toast.success(`Badge ${isActive ? 'activated' : 'deactivated'} successfully`);
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to update badge status';
			toast.error(message);
			throw err;
		}
	};

	const getBadgeById = async (badgeId: string) => {
		const response = await fetchBadgeDetail(badgeId);
		return response.data;
	};

	return {
		badges,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy: sortingState.sortBy,
		sortOrder: sortingState.sortOrder,
		handleSort: sortingActions.handleSort as (column: string) => void,
		filters,
		setFilters,
		refetch: fetchData,
		toggleBadgeStatus,
		getBadgeById,
	};
}

