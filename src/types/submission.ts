export enum SubmissionStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	ERROR = 'error',
	TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
	MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded',
	COMPILATION_ERROR = 'compilation_error',
}

export enum SubmissionType {
	PROBLEM = 'problem',
	CONTEST = 'contest',
}

export interface SubmissionUser {
	id: string;
	username: string;
	email: string;
}

export interface SubmissionProblem {
	id: string;
	title: string;
	slug: string;
}

export interface SubmissionLanguage {
	id: number;
	name: string;
}

export interface Submission {
	id: string;
	user: SubmissionUser;
	problem: SubmissionProblem;
	sourceCode: string;
	language: SubmissionLanguage;
	status: SubmissionStatus | string;
	score: number;
	totalExecutionTime: number;
	maxMemoryUsage: number;
	submissionType: SubmissionType | string;
	testCasesPassed: number;
	totalTestCases: number;
	createdAt: string;
}

export interface SubmissionSummary {
	totalSubmissions: number;
	acceptedCount: number;
	rejectedCount: number;
	pendingCount: number;
	problemSubmissionsCount: number;
	contestSubmissionsCount: number;
}

export interface SubmissionsPagination {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	limit: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface SubmissionsQuery {
	page?: number;
	limit?: number;
	status?: SubmissionStatus | string;
	problemId?: string;
	userId?: string;
	submissionType?: SubmissionType | string;
	startDate?: string;
	endDate?: string;
	search?: string;
	sortBy?: 'createdAt' | 'score' | 'totalExecutionTime' | 'maxMemoryUsage';
	sortOrder?: 'asc' | 'desc';
}

export interface SubmissionsResponse {
	success: boolean;
	message: string;
	data: {
		submissions: Submission[];
		pagination: SubmissionsPagination;
		summary: SubmissionSummary;
		filters?: {
			status?: string;
			problemId?: string;
			userId?: string;
			submissionType?: string;
			startDate?: string;
			endDate?: string;
			search?: string;
		};
	};
}

