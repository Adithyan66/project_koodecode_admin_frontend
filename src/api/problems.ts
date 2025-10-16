import axiosInstance from './axios';
import type { ProblemsQuery, ProblemsResponse } from '../types/problem';
import type { LanguageApiMap, LanguageItem } from '../types/language';

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


