import axiosInstance from './axios';
import type { DashboardResponse } from '../types/dashboard';

interface DashboardApiResponse {
	success: boolean;
	message: string;
	data: DashboardResponse;
}

export async function fetchDashboard(): Promise<DashboardResponse> {
	const { data } = await axiosInstance.get<DashboardApiResponse>('/admin/dashboard');
	return data.data;
}

