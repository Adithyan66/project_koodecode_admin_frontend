export type BadgeType =
	| 'problem_solver'
	| 'streak_master'
	| 'contest_winner'
	| 'language_expert'
	| 'daily_coder'
	| 'difficulty_master'
	| 'speed_demon'
	| 'consistency'
	| 'milestone';

export type BadgeCategory = 'achievement' | 'progress' | 'milestone' | 'special' | 'seasonal';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AdminBadge {
	id: string;
	name: string;
	description: string;
	type: BadgeType;
	category: BadgeCategory;
	rarity: BadgeRarity;
	iconUrl: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	criteria?: BadgeCriteria;
	holderCount?: number;
}

export interface BadgeCriteria {
	type: string;
	threshold: number;
	description: string;
	metadata?: Record<string, unknown> | null;
}

export interface BadgeListResponse {
	success: boolean;
	message: string;
	data: {
		items: AdminBadge[];
		total: number;
		page: number;
		limit: number;
	};
}

export interface BadgeDetailResponse {
	success: boolean;
	message: string;
	data: AdminBadge & {
		criteria: BadgeCriteria;
	};
}

export interface BadgeHolder {
	userId: string;
	fullName: string;
	email: string;
	userName: string;
	awardedAt: string;
}

export interface BadgeHoldersResponse {
	success: boolean;
	message: string;
	data: {
		badgeId: string;
		items: BadgeHolder[];
		total: number;
		page: number;
		limit: number;
	};
}

