import axiosInstance from './axios';
import type {
	UsersResponse,
	UserDetailResponse,
	UserContestData,
	UserSubmissionData,
	UserFinancialData,
	UserStoreData,
	UserSocialData,
	UserRoomData,
	UserAchievementData,
	UserAnalyticsData
} from '../types/user';

export interface UsersQuery {
	search?: string;
	page?: number;
	limit?: number;
}

export async function fetchUsers(params?: UsersQuery): Promise<UsersResponse> {
	const { data } = await axiosInstance.get<UsersResponse>('/admin/users', { params });
	return data;
}

export async function fetchUserDetail(userId: string): Promise<UserDetailResponse> {
	const { data } = await axiosInstance.get<UserDetailResponse>(`/admin/users/${userId}`);
	return data;
}

export async function fetchUserContestData(userId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: UserContestData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/contests`, { params });
	return data;
}

export async function fetchUserSubmissionData(userId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: UserSubmissionData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/submissions`, { params });
	return data;
}

export async function fetchUserFinancialData(userId: string, params?: { 
	coinPage?: number; 
	coinLimit?: number; 
	paymentPage?: number; 
	paymentLimit?: number; 
}): Promise<{ success: boolean; data: UserFinancialData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/financial`, { params });
	return data;
}

export async function fetchUserStoreData(userId: string): Promise<{ success: boolean; data: UserStoreData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/store`);
	return data;
}

export async function fetchUserSocialData(userId: string): Promise<{ success: boolean; data: UserSocialData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/social`);
	return data;
}

export async function fetchUserRoomData(userId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: UserRoomData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/rooms`, { params });
	return data;
}

export async function fetchUserAchievementData(userId: string): Promise<{ success: boolean; data: UserAchievementData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/achievements`);
	return data;
}

export async function fetchUserAnalyticsData(userId: string): Promise<{ success: boolean; data: UserAnalyticsData }> {
	const { data } = await axiosInstance.get(`/admin/users/${userId}/analytics`);
	return data;
}

// Admin actions
export async function blockUser(userId: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/users/${userId}/block`, { isBlocked: true });
	return data;
}

export async function unblockUser(userId: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/users/${userId}/block`, { isBlocked: false });
	return data;
}

export async function resetUserPassword(userId: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/users/${userId}/reset-password`);
	return data;
}

export async function deleteUserAccount(userId: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.delete(`/admin/users/${userId}`);
	return data;
}

export async function sendUserMail(userId: string, subject: string, message: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.post(`/admin/users/${userId}/send-mail`, { subject, message });
	return data;
}
