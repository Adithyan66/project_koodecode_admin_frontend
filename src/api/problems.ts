// import axiosInstance from './axios';
// import type { ProblemsQuery, ProblemsResponse } from '../types/problem';
// import type { LanguageApiMap, LanguageItem } from '../types/language';

// export async function fetchProblems(params: ProblemsQuery): Promise<ProblemsResponse> {
// 	const { data } = await axiosInstance.get<ProblemsResponse>('/admin/problems', { params });
// 	return data;
// }

// export async function fetchLanguages(): Promise<LanguageItem[]> {
// 	const { data } = await axiosInstance.get<{ success: boolean; data: LanguageApiMap }>('/admin/problems/get-languages');
// 	const map = data.data || {};
// 	return Object.entries(map).map(([id, v]) => ({ id: parseInt(id, 10), name: v.name, extension: v.extension }));
// }

// export async function createProblem(payload: any): Promise<{ success: boolean; message: string; data?: any }> {
// 	const { data } = await axiosInstance.post('/admin/problems/create-problem', payload);
// 	return data;
// }


import axiosInstance from './axios';
import type { ProblemsQuery, ProblemsResponse } from '../types/problem';
import type { LanguageApiMap, LanguageItem } from '../types/language';
import type {
  ProblemDetailResponse,
  TestCasesResponse,
  UpdateProblemPayload,
  CreateTestCasePayload,
  UpdateTestCasePayload,
} from '../types/problemDetail';

export async function fetchProblems(params: ProblemsQuery): Promise<ProblemsResponse> {
  const { data } = await axiosInstance.get<ProblemsResponse>('/admin/problems', { params });
  return data;
}

export async function fetchLanguages(): Promise<LanguageItem[]> {
  const { data } = await axiosInstance.get<{ success: boolean; data: LanguageApiMap }>('/admin/problems/get-languages');
  const map = data.data || {};
  return Object.entries(map).map(([id, v]) => ({ id: parseInt(id, 10), name: v.name, extension: v.extension }));
}

export async function createProblem(payload: any): Promise<{ success: boolean; message: string; data?: any }> {
  const { data } = await axiosInstance.post('/admin/problems/create-problem', payload);
  return data;
}

// Problem Detail Operations
export async function fetchProblemDetail(slug: string): Promise<ProblemDetailResponse> {
  const { data } = await axiosInstance.get<ProblemDetailResponse>(`/admin/problems/${slug}`);
  return data;
}

export async function updateProblem(slug: string, payload: UpdateProblemPayload): Promise<{ success: boolean; message: string; data?: any }> {
  const { data } = await axiosInstance.put(`/admin/problems/${slug}`, payload);
  return data;
}

export async function deleteProblem(slug: string): Promise<{ success: boolean; message: string }> {
  const { data } = await axiosInstance.delete(`/admin/problems/${slug}`);
  return data;
}

export async function cloneProblem(slug: string): Promise<{ success: boolean; message: string; data?: any }> {
  const { data } = await axiosInstance.post(`/admin/problems/${slug}/clone`);
  return data;
}

// Test Cases Operations
export async function fetchTestCases(slug: string, page: number = 1, limit: number = 10): Promise<TestCasesResponse> {
  const { data } = await axiosInstance.get<TestCasesResponse>(`/admin/problems/${slug}/testcases`, {
    params: { page, limit }
  });
  return data;
}

export async function createTestCase(slug: string, payload: CreateTestCasePayload): Promise<{ success: boolean; message: string; data?: any }> {
  const { data } = await axiosInstance.post(`/admin/problems/${slug}/testcases`, payload);
  return data;
}

export async function updateTestCase(slug: string, testCaseId: string, payload: UpdateTestCasePayload): Promise<{ success: boolean; message: string; data?: any }> {
  const { data } = await axiosInstance.put(`/admin/problems/${slug}/testcases/${testCaseId}`, payload);
  return data;
}

export async function deleteTestCase(slug: string, testCaseId: string): Promise<{ success: boolean; message: string }> {
  const { data } = await axiosInstance.delete(`/admin/problems/${slug}/testcases/${testCaseId}`);
  return data;
}