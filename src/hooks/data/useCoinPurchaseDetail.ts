import { useState, useEffect } from 'react';
import { 
	fetchCoinPurchaseDetail, 
	reconcilePurchase, 
	cancelPurchase, 
	markPurchaseAsFailed,
	sendPaymentReminder,
	notifyPurchaseStatus,
	addReconciliationNotes,
	processRefund
} from '../../api/coinPurchases';
import type { CoinPurchaseDetail, PurchaseUser } from '../../types/coinPurchase';

interface UseCoinPurchaseDetailResult {
	purchase: CoinPurchaseDetail | null;
	user: PurchaseUser | null;
	canReconcile: boolean;
	isStale: boolean;
	loading: boolean;
	error: string | null;
	actionLoading: boolean;
	actionError: string | null;
	handleReconcile: (notes?: string) => Promise<void>;
	handleCancel: () => Promise<void>;
	handleMarkAsFailed: (reason?: string) => Promise<void>;
	handleSendReminder: () => Promise<void>;
	handleNotifySuccess: () => Promise<void>;
	handleNotifyFailure: () => Promise<void>;
	handleAddNotes: (notes: string) => Promise<void>;
	handleProcessRefund: (reason?: string) => Promise<void>;
	refetch: () => Promise<void>;
}

export function useCoinPurchaseDetail(purchaseId: string): UseCoinPurchaseDetailResult {
	const [purchase, setPurchase] = useState<CoinPurchaseDetail | null>(null);
	const [user, setUser] = useState<PurchaseUser | null>(null);
	const [canReconcile, setCanReconcile] = useState(false);
	const [isStale, setIsStale] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionLoading, setActionLoading] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);

	const fetchDetail = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetchCoinPurchaseDetail(purchaseId);
			setPurchase(response.data.purchase);
			setUser(response.data.user);
			setCanReconcile(response.data.canReconcile);
			setIsStale(response.data.isStale);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch purchase details');
		} finally {
			setLoading(false);
		}
	};

	const handleReconcile = async (notes?: string) => {
		setActionLoading(true);
		setActionError(null);
		try {
			await reconcilePurchase(purchaseId, notes);
			await fetchDetail();
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to reconcile purchase');
		} finally {
			setActionLoading(false);
		}
	};

	const handleCancel = async (notes?: string) => {
		setActionLoading(true);
		setActionError(null);
		try {
			await cancelPurchase(purchaseId, notes);
			await fetchDetail();
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to cancel purchase');
		} finally {
			setActionLoading(false);
		}
	};

	const handleMarkAsFailed = async (reason?: string) => {
		setActionLoading(true);
		setActionError(null);
		try {
			await markPurchaseAsFailed(purchaseId, reason);
			await fetchDetail();
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to mark as failed');
		} finally {
			setActionLoading(false);
		}
	};

	const handleSendReminder = async () => {
		setActionLoading(true);
		setActionError(null);
		try {
			await sendPaymentReminder(purchaseId);
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to send reminder');
		} finally {
			setActionLoading(false);
		}
	};

	const handleNotifySuccess = async () => {
		setActionLoading(true);
		setActionError(null);
		try {
			await notifyPurchaseStatus(purchaseId, 'success');
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to send notification');
		} finally {
			setActionLoading(false);
		}
	};

	const handleNotifyFailure = async () => {
		setActionLoading(true);
		setActionError(null);
		try {
			await notifyPurchaseStatus(purchaseId, 'failure');
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to send notification');
		} finally {
			setActionLoading(false);
		}
	};

	const handleAddNotes = async (notes: string) => {
		setActionLoading(true);
		setActionError(null);
		try {
			await addReconciliationNotes(purchaseId, notes);
			await fetchDetail();
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to add notes');
		} finally {
			setActionLoading(false);
		}
	};

	const handleProcessRefund = async (reason?: string) => {
		setActionLoading(true);
		setActionError(null);
		try {
			await processRefund(purchaseId, reason);
			await fetchDetail();
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to process refund');
		} finally {
			setActionLoading(false);
		}
	};

	useEffect(() => {
		if (purchaseId) {
			fetchDetail();
		}
	}, [purchaseId]);

	return {
		purchase,
		user,
		canReconcile,
		isStale,
		loading,
		error,
		actionLoading,
		actionError,
		handleReconcile,
		handleCancel,
		handleMarkAsFailed,
		handleSendReminder,
		handleNotifySuccess,
		handleNotifyFailure,
		handleAddNotes,
		handleProcessRefund,
		refetch: fetchDetail,
	};
}

