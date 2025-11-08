export interface SubmissionDetailUser {
	id: string;
	username: string;
	email: string;
	fullName?: string;
}

export interface SubmissionDetailProblem {
	id: string;
	title: string;
	slug: string;
	difficulty: string;
	problemNumber?: number;
}

export interface SubmissionDetailLanguage {
	id: number;
	name: string;
	extension: string;
}

export type TestCaseStatus = 'passed' | 'failed' | 'error' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'compilation_error';

export interface SubmissionTestCaseResult {
	testCaseId: string;
	input: string;
	expectedOutput: string;
	actualOutput?: string;
	status: TestCaseStatus;
	executionTime?: number;
	memoryUsage?: number;
	judge0Token?: string;
	errorMessage?: string;
}

export interface SubmissionDetailPerformanceMetrics {
	totalExecutionTime: number;
	maxMemoryUsage: number;
	averageExecutionTime: number;
	averageMemoryUsage: number;
}

export interface SubmissionDetail {
	id: string;
	user: SubmissionDetailUser;
	problem: SubmissionDetailProblem;
	sourceCode: string;
	language: SubmissionDetailLanguage;
	status: string;
	overallVerdict: string;
	score: number;
	testCaseResults: SubmissionTestCaseResult[];
	testCasesPassed: number;
	totalTestCases: number;
	performanceMetrics: SubmissionDetailPerformanceMetrics;
	submissionType: 'problem' | 'contest';
	judge0Token?: string;
	judge0Status?: any;
	createdAt: string;
	updatedAt: string;
}

export interface SubmissionDetailResponse {
	success: boolean;
	message: string;
	data: SubmissionDetail;
}
