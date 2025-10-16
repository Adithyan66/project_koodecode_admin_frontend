import axiosInstance from './axios';
import type { LoginResponse } from '../types/auth';

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
	// Adjust endpoint path to match your backend
	const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });
	return data;
}


