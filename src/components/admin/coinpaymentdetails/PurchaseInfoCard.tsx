import { CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../Card';
import type { CoinPurchaseDetail, PurchaseStatus, PaymentMethod } from '../../../types/coinPurchase';
import { PurchaseStatus as PS } from '../../../types/coinPurchase';

interface PurchaseInfoCardProps {
	purchase: CoinPurchaseDetail;
}

const getStatusBadge = (status: PurchaseStatus) => {
	const statusConfig = {
		[PS.COMPLETED]: {
			label: 'Completed',
			icon: CheckCircle,
			className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		},
		[PS.PENDING]: {
			label: 'Pending',
			icon: Clock,
			className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		},
		[PS.FAILED]: {
			label: 'Failed',
			icon: XCircle,
			className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
		},
		[PS.CANCELLED]: {
			label: 'Cancelled',
			icon: XCircle,
			className: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
		},
		[PS.REFUNDED]: {
			label: 'Refunded',
			icon: RotateCcw,
			className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		},
	};

	const config = statusConfig[status] || statusConfig[PS.PENDING];
	const Icon = config.icon;

	return (
		<span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${config.className}`}>
			<Icon className="h-4 w-4" />
			{config.label}
		</span>
	);
};

const getPaymentMethodLabel = (method: PaymentMethod) => {
	const labels = {
		['upi']: 'UPI',
		['card']: 'Card',
		['net_banking']: 'Net Banking',
		['wallet']: 'Wallet',
		['emi']: 'EMI',
	};
	return labels[method as keyof typeof labels] || method;
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const formatCurrency = (amount: number, currency: string) => {
	return `₹${amount.toLocaleString('en-IN')} ${currency}`;
};

export default function PurchaseInfoCard({ purchase }: PurchaseInfoCardProps) {
	const hasRefundInfo = purchase.refundedAt || purchase.refundedBy || purchase.refundNotes;

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">Purchase Information</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-gray-600">Status</p>
						<div className="mt-1">{getStatusBadge(purchase.status)}</div>
					</div>
					<div>
						<p className="text-sm text-gray-600">Payment Method</p>
						<p className="mt-1 font-medium capitalize">{getPaymentMethodLabel(purchase.paymentMethod)}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Coins</p>
						<p className="mt-1 font-semibold text-lg">{purchase.coins.toLocaleString('en-IN')}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">Amount</p>
						<p className="mt-1 font-semibold text-lg text-green-600">
							{formatCurrency(purchase.amount, purchase.currency)}
						</p>
					</div>
					{purchase.externalOrderId && (
						<div>
							<p className="text-sm text-gray-600">Order ID</p>
							<p className="mt-1 font-mono text-sm">{purchase.externalOrderId}</p>
						</div>
					)}
					{purchase.externalPaymentId && (
						<div>
							<p className="text-sm text-gray-600">Payment ID</p>
							<p className="mt-1 font-mono text-sm">{purchase.externalPaymentId}</p>
						</div>
					)}
					<div>
						<p className="text-sm text-gray-600">Created At</p>
						<p className="mt-1">{formatDate(purchase.createdAt)}</p>
					</div>
					{purchase.completedAt && (
						<div>
							<p className="text-sm text-gray-600">Completed At</p>
							<p className="mt-1">{formatDate(purchase.completedAt)}</p>
						</div>
					)}
					{purchase.failedAt && (
						<div>
							<p className="text-sm text-gray-600">Failed At</p>
							<p className="mt-1">{formatDate(purchase.failedAt)}</p>
						</div>
					)}
					{purchase.failureReason && (
						<div className="col-span-2">
							<p className="text-sm text-gray-600">Failure Reason</p>
							<p className="mt-1 text-red-600">{purchase.failureReason}</p>
						</div>
					)}
					{purchase.reconciledAt && (
						<div>
							<p className="text-sm text-gray-600">Reconciled At</p>
							<p className="mt-1">{formatDate(purchase.reconciledAt)}</p>
						</div>
					)}
					{/* {purchase.receipt && (
						<div className="col-span-2">
							<p className="text-sm text-gray-600">Receipt</p>
							<a href={purchase.receipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
								View Receipt
							</a>
						</div>
					)} */}
				</div>

				{hasRefundInfo && (
					<div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
						<h3 className="mb-3 text-base font-semibold text-red-800 dark:text-red-400">Refund Information</h3>
						<div className="grid grid-cols-2 gap-4">
							{purchase.refundedAt && (
								<div>
									<p className="text-sm font-medium text-gray-600">Refunded At</p>
									<p className="mt-1 text-red-600">{formatDate(purchase.refundedAt)}</p>
								</div>
							)}
							{purchase.refundedBy && (
								<div>
									<p className="text-sm font-medium text-gray-600">Refunded By</p>
									<p className="mt-1 text-gray-700 dark:text-gray-300">{purchase.refundedByUser.userName}</p>
								</div>
							)}
							{purchase.refundNotes && (
								<div className="col-span-2">
									<p className="text-sm font-medium text-gray-600">Refund Notes</p>
									<p className="mt-1 whitespace-pre-wrap text-sm">{purchase.refundNotes}</p>
								</div>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

