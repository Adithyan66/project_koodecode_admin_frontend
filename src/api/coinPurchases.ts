import axiosInstance from './axios';
import type { CoinPurchasesResponse, CoinPurchasesQuery, CoinPurchaseDetailResponse } from '../types/coinPurchase';

export async function fetchCoinPurchases(params?: CoinPurchasesQuery): Promise<CoinPurchasesResponse> {
	const { data } = await axiosInstance.get<CoinPurchasesResponse>('/admin/coins/purchases', { params });
	return data;
}

export async function fetchCoinPurchaseDetail(purchaseId: string): Promise<CoinPurchaseDetailResponse> {
	const { data } = await axiosInstance.get<CoinPurchaseDetailResponse>(`/admin/coins/purchases/${purchaseId}`);
	return data;
}

export async function reconcilePurchase(purchaseId: string, notes?: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/coins/purchases/${purchaseId}/reconcile`, { notes });
	return data;
}

export async function cancelPurchase(purchaseId: string, notes?: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/coins/purchases/${purchaseId}/cancel`, { notes });
	return data;
}

export async function markPurchaseAsFailed(purchaseId: string, reason?: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/coins/purchases/${purchaseId}/fail`, { notes: reason });
	return data;
}

export async function sendPaymentReminder(purchaseId: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.post(`/admin/coins/purchases/${purchaseId}/reminder`);
	return data;
}

export async function notifyPurchaseStatus(purchaseId: string, status: 'success' | 'failure'): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.post(`/admin/coins/purchases/${purchaseId}/notify`, { status });
	return data;
}

export async function addReconciliationNotes(purchaseId: string, notes: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.patch(`/admin/coins/purchases/${purchaseId}/notes`, { notes });
	return data;
}

export async function processRefund(purchaseId: string, reason?: string): Promise<{ success: boolean; message: string }> {
	const { data } = await axiosInstance.post(`/admin/coins/purchases/${purchaseId}/refund`, { notes: reason });
	return data;
}
