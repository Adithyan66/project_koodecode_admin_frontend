import axiosInstance from './axios';
import type { LoginResponse } from '../types/auth';

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
	// Adjust endpoint path to match your backend
	const { data } = await axiosInstance.post<LoginResponse>('/auth/admin-login', { email, password });
	return data;
}

export async function refreshTokenRequest(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
	const { data } = await axiosInstance.post('/auth/refresh-token', { refreshToken });
	return data;
}


