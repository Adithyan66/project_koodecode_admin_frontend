export const PurchaseStatus = {
	PENDING: 'pending',
	COMPLETED: 'completed',
	FAILED: 'failed',
	CANCELLED: 'cancelled',
	REFUNDED: 'refunded',
} as const;

export type PurchaseStatus = (typeof PurchaseStatus)[keyof typeof PurchaseStatus];

export interface Note {
	text: string;
	createdAt: string;
	createdBy: string;
	createdByUserName?: string;
}

export const PaymentMethod = {
	UPI: 'upi',
	CARD: 'card',
	NET_BANKING: 'net_banking',
	WALLET: 'wallet',
	EMI: 'emi',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface CoinPurchase {
	id: string;
	userId: string;
	userEmail: string;
	userName: string;
	coins: number;
	amount: number;
	currency: string;
	status: PurchaseStatus;
	paymentMethod: PaymentMethod;
	externalOrderId: string;
	createdAt: string;
	completedAt?: string | null;
}

export interface CoinPurchasesStats {
	totalPurchasesThisMonth: number;
	totalRevenueThisMonth: number;
	pendingPurchases: number;
	failedPurchases: number;
	currency: string;
}

export interface CoinPurchasesPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface CoinPurchasesResponse {
	success: boolean;
	message: string;
	data: {
		purchases: CoinPurchase[];
		stats: CoinPurchasesStats;
		pagination: CoinPurchasesPagination;
	};
}

export interface CoinPurchasesQuery {
	page?: number;
	limit?: number;
	search?: string;
	status?: PurchaseStatus;
	paymentMethod?: PaymentMethod;
	dateRange?: 'this_month' | 'last_month' | 'custom';
	startDate?: string;
	endDate?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface CoinPurchaseDetail extends CoinPurchase {
	externalPaymentId?: string;
	receipt?: string;
	failedAt?: string | null;
	failureReason?: string;
	paymentMethodDetails?: Record<string, any>;
	ipAddress?: string;
	userAgent?: string;
	razorpayOrderStatus?: string;
	webhookVerified?: boolean;
	reconciliationNotes?: string;
	reconciledAt?: string | null;
	refundedAt?: string | null;
	refundNotes?: string | null;
	refundedBy?: string | null;
	refundedByUser:{
		userName:string;
	}
	notes?: Note[];
	updatedAt: string;
}

export interface PurchaseUser {
	id: string;
	fullName: string;
	userName: string;
	email: string;
	profilePicKey?: string;
}

export interface CoinPurchaseDetailResponse {
	success: boolean;
	message: string;
	data: {
		purchase: CoinPurchaseDetail;
		user: PurchaseUser;
		canReconcile: boolean;
		isStale: boolean;
	};
}

