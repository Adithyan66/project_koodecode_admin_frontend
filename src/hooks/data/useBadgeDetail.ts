import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
	fetchBadgeDetail,
	fetchBadgeHolders,
	type BadgeHoldersQuery,
	updateBadge,
	updateBadgeStatus,
	type UpdateBadgePayload,
} from '../../api/badges';
import type { BadgeDetailResponse, BadgeHolder } from '../../types/badge';
import { usePagination } from '../utils/usePagination';
import { ImageUploadService } from '../../services/ImageUploadService';
import { imageKitService } from '../../services/ImageKitService';

export interface UseBadgeDetailResult {
	badge: BadgeDetailResponse['data'] | null;
	loading: boolean;
	error: string | null;
	saving: boolean;
	iconUploading: boolean;
	iconUploadProgress: number;
	updateBadgeDetails: (payload: UpdateBadgePayload) => Promise<void>;
	toggleBadgeActive: (isActive: boolean) => Promise<void>;
	uploadBadgeIcon: (file: File) => Promise<{ iconKey: string; previewUrl: string }>;
	refetch: () => Promise<void>;
	holders: BadgeHolder[];
	holdersLoading: boolean;
	holdersError: string | null;
	holdersPagination: ReturnType<typeof usePagination>['state'] & { totalCount: number };
	holdersPaginationActions: ReturnType<typeof usePagination>['actions'];
}

export function useBadgeDetail(badgeId: string): UseBadgeDetailResult {
	const [badge, setBadge] = useState<BadgeDetailResponse['data'] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [iconUploading, setIconUploading] = useState(false);
	const [iconUploadProgress, setIconUploadProgress] = useState(0);

	const [holders, setHolders] = useState<BadgeHolder[]>([]);
	const [holdersLoading, setHoldersLoading] = useState(false);
	const [holdersError, setHoldersError] = useState<string | null>(null);
	const [holdersTotal, setHoldersTotal] = useState(0);

	const { state: holdersPaginationState, actions: holdersPaginationActions } = usePagination({
		initialPage: 1,
		initialLimit: 20,
		totalCount: holdersTotal,
	});

	const holdersPagination = useMemo(
		() => ({
			...holdersPaginationState,
			totalCount: holdersTotal,
		}),
		[holdersPaginationState, holdersTotal],
	);

	const fetchBadge = useCallback(async () => {
		if (!badgeId) return;
		setLoading(true);
		setError(null);
		try {
			const response = await fetchBadgeDetail(badgeId);
			setBadge(response.data);
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to load badge';
			setError(message);
			setBadge(null);
		} finally {
			setLoading(false);
		}
	}, [badgeId]);

	const fetchHoldersList = useCallback(
		async (query: BadgeHoldersQuery) => {
			if (!badgeId) return;
			setHoldersLoading(true);
			setHoldersError(null);
			try {
				const response = await fetchBadgeHolders(badgeId, query);
				setHolders(response.data.items);
				setHoldersTotal(response.data.total);
			} catch (err: any) {
				const message = err?.response?.data?.message || err?.message || 'Failed to load badge holders';
				setHoldersError(message);
				setHolders([]);
			} finally {
				setHoldersLoading(false);
			}
		},
		[badgeId],
	);

	useEffect(() => {
		fetchBadge();
	}, [fetchBadge]);

	useEffect(() => {
		fetchHoldersList({
			page: holdersPagination.page,
			limit: holdersPagination.limit,
		});
	}, [fetchHoldersList, holdersPagination.page, holdersPagination.limit]);

	const updateBadgeDetails = async (payload: UpdateBadgePayload) => {
		if (!badgeId) return;
		setSaving(true);
		try {
			const response = await updateBadge(badgeId, payload);
			setBadge(response.data);
			toast.success('Badge updated successfully');
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to update badge';
			toast.error(message);
			throw err;
		} finally {
			setSaving(false);
		}
	};

	const toggleBadgeActive = async (isActive: boolean) => {
		if (!badgeId) return;
		setSaving(true);
		try {
			const response = await updateBadgeStatus(badgeId, isActive);
			setBadge(response.data);
			toast.success(`Badge ${isActive ? 'activated' : 'deactivated'} successfully`);
		} catch (err: any) {
			const message = err?.response?.data?.message || err?.message || 'Failed to update status';
			toast.error(message);
			throw err;
		} finally {
			setSaving(false);
		}
	};

	const uploadBadgeIcon = async (file: File) => {
		setIconUploading(true);
		setIconUploadProgress(0);
		try {
			const iconKey = await ImageUploadService.uploadImage('badge-icons', file, (progress) => setIconUploadProgress(progress));
			const previewUrl = imageKitService.getBadgeIconUrl(iconKey, 96);
			return { iconKey, previewUrl };
		} catch (err: any) {
			const message = err?.message || 'Failed to upload icon';
			toast.error(message);
			throw err;
		} finally {
			setIconUploading(false);
			setIconUploadProgress(0);
		}
	};

	return {
		badge,
		loading,
		error,
		saving,
		iconUploading,
		iconUploadProgress,
		updateBadgeDetails,
		toggleBadgeActive,
		uploadBadgeIcon,
		refetch: fetchBadge,
		holders,
		holdersLoading,
		holdersError,
		holdersPagination,
		holdersPaginationActions,
	};
}

