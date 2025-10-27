import { Card, CardHeader, CardContent } from '../../Card';
import type { CoinPurchaseDetail } from '../../../types/coinPurchase';

interface RefundDetailsCardProps {
	purchase: CoinPurchaseDetail;
}

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export default function RefundDetailsCard({ purchase }: RefundDetailsCardProps) {
	// Show card if refund was processed (check status or any refund field)
	const hasRefundInfo = purchase.refundedAt || purchase.refundedBy || purchase.refundNotes || purchase.status === 'refunded';
	
	if (!hasRefundInfo) return null;

	return (
		<Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
			<CardHeader className="text-lg font-semibold text-red-800 dark:text-red-400">Refund Information</CardHeader>
			<CardContent className="space-y-3">
				{purchase.refundedAt && (
					<div>
						<p className="text-sm font-medium text-gray-600">Refunded At</p>
						<p className="text-red-600">{formatDate(purchase.refundedAt)}</p>
					</div>
				)}
				{purchase.refundedBy && (
					<div>
						<p className="text-sm font-medium text-gray-600">Refunded By</p>
						<p className="text-gray-700 dark:text-gray-300">{purchase.refundedBy}</p>
					</div>
				)}
				{purchase.refundNotes && (
					<div>
						<p className="text-sm font-medium text-gray-600">Refund Notes</p>
						<p className="whitespace-pre-wrap text-sm">{purchase.refundNotes}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

