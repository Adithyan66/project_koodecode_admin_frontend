import axiosInstance from './axios';
import type { UsersResponse } from '../types/user';

export interface UsersQuery {
	search?: string;
	page?: number;
	limit?: number;
}

export async function fetchUsers(params?: UsersQuery): Promise<UsersResponse> {
	const { data } = await axiosInstance.get<UsersResponse>('/admin/users', { params });
	return data;
}
