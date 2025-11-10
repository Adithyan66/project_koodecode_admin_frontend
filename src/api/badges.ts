import axiosInstance from './axios';
import type {
	AdminBadge,
	BadgeDetailResponse,
	BadgeHoldersResponse,
	BadgeListResponse,
	BadgeRarity,
	BadgeCategory,
	BadgeType,
} from '../types/badge';

export interface BadgeQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	types?: BadgeType[] | BadgeType | string;
	categories?: BadgeCategory[] | BadgeCategory | string;
	rarities?: BadgeRarity[] | BadgeRarity | string;
	includeInactive?: boolean;
	sortField?: 'name' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

const serializeFilter = (value?: string | string[]): string | undefined => {
	if (!value) return undefined;
	if (Array.isArray(value)) {
		return value.join(',');
	}
	return value;
};

export async function fetchBadges(params: BadgeQueryParams = {}): Promise<BadgeListResponse> {
	const query: Record<string, unknown> = {
		page: params.page,
		limit: params.limit,
		search: params.search,
		includeInactive: params.includeInactive,
		sortField: params.sortField,
		sortOrder: params.sortOrder,
	};

	const types = serializeFilter(params.types as string | string[]);
	const categories = serializeFilter(params.categories as string | string[]);
	const rarities = serializeFilter(params.rarities as string | string[]);

	if (types) query.types = types;
	if (categories) query.categories = categories;
	if (rarities) query.rarities = rarities;

	const { data } = await axiosInstance.get<BadgeListResponse>('/admin/badges', { params: query });
	return data;
}

export async function fetchBadgeDetail(badgeId: string): Promise<BadgeDetailResponse> {
	const { data } = await axiosInstance.get<BadgeDetailResponse>(`/admin/badges/${badgeId}`);
	return data;
}

export interface UpdateBadgePayload {
	name?: string;
	description?: string;
	type?: BadgeType;
	category?: BadgeCategory;
	rarity?: BadgeRarity;
	iconUrl?: string;
	isActive?: boolean;
	criteria?: {
		type?: string;
		threshold?: number;
		description?: string;
		metadata?: Record<string, unknown> | null;
	};
}

export async function updateBadge(badgeId: string, payload: UpdateBadgePayload): Promise<BadgeDetailResponse> {
	const { data } = await axiosInstance.patch<BadgeDetailResponse>(`/admin/badges/${badgeId}`, payload);
	return data;
}

export async function updateBadgeStatus(badgeId: string, isActive: boolean): Promise<BadgeDetailResponse> {
	const { data } = await axiosInstance.patch<BadgeDetailResponse>(`/admin/badges/${badgeId}/status`, { isActive });
	return data;
}

export interface BadgeHoldersQuery {
	page?: number;
	limit?: number;
}

export async function fetchBadgeHolders(badgeId: string, params: BadgeHoldersQuery = {}): Promise<BadgeHoldersResponse> {
	const { data } = await axiosInstance.get<BadgeHoldersResponse>(`/admin/badges/${badgeId}/holders`, { params });
	return data;
}

export type { AdminBadge };

