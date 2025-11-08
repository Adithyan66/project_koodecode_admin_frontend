import axiosInstance from './axios';
import type { SubmissionsResponse, SubmissionsQuery } from '../types/submission';
import type { SubmissionDetailResponse } from '../types/submissionDetail';

export async function fetchSubmissions(params?: SubmissionsQuery): Promise<SubmissionsResponse> {
	const { data } = await axiosInstance.get<SubmissionsResponse>('/admin/submissions', { params });
	return data;
}

export async function fetchSubmissionDetail(submissionId: string): Promise<SubmissionDetailResponse> {
	const { data } = await axiosInstance.get<SubmissionDetailResponse>(`/admin/submissions/${submissionId}`);
	return data;
}

