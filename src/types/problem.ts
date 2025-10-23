import type { SortOrder } from '../hooks/utils/useSorting';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ProblemStatus = 'active' | 'inactive';

export interface ProblemListItem {
	id: string;
	problemNumber: number;
	title: string;
	slug: string;
	difficulty: Difficulty;
	status: ProblemStatus;
	acceptanceRate: number;
	totalSubmissions: number;
	createdAt: string;
}

export interface ProblemsSummary {
	totalProblems: number;
	activeCount: number;
	inactiveCount: number;
	easyCount: number;
	mediumCount: number;
	hardCount: number;
	averageAcceptanceRate: number;
	totalSubmissionsAcrossAll: number;
}

export interface ProblemsPagination {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	limit: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface ProblemsResponse {
	success: boolean;
	message: string;
	data: {
		problems: ProblemListItem[];
		pagination: ProblemsPagination;
		summary: ProblemsSummary;
		filters: Record<string, unknown>;
	};
}

export type ProblemsSortBy = 'problemNumber' | 'title' | 'difficulty' | 'acceptanceRate' | 'totalSubmissions' | 'createdAt';
export type { SortOrder };

export interface ProblemsQuery {
	search?: string;
	difficulty?: Difficulty | '';
	status?: ProblemStatus | '';
	page?: number;
	limit?: number;
	sortBy?: ProblemsSortBy;
	sortOrder?: SortOrder;
}


