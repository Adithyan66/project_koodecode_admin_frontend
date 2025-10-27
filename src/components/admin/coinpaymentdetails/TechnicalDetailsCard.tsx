import { Card, CardHeader, CardContent } from '../../Card';
import type { CoinPurchaseDetail } from '../../../types/coinPurchase';

interface TechnicalDetailsCardProps {
	purchase: CoinPurchaseDetail;
}

export default function TechnicalDetailsCard({ purchase }: TechnicalDetailsCardProps) {
	const renderPaymentMethodDetails = () => {
		if (!purchase.paymentMethodDetails || Object.keys(purchase.paymentMethodDetails).length === 0) {
			return null;
		}

		const details = purchase.paymentMethodDetails;
		const entries = Object.entries(details);

		return (
			<div className="col-span-2">
				<p className="mb-3 text-sm font-medium text-gray-600">Payment Method Details</p>
				<div className="overflow-hidden rounded-lg border dark:border-gray-700">
					<table className="min-w-full">
						<tbody>
							{entries.map(([key, value]) => (
								<tr key={key} className="border-b last:border-b-0 dark:border-gray-700">
									<td className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400">
										{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
									</td>
									<td className="px-4 py-2 font-mono text-sm">
										{typeof value === 'object' ? JSON.stringify(value) : String(value)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">Technical Details</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					{purchase.razorpayOrderStatus && (
						<div>
							<p className="text-sm text-gray-600">Razorpay Status</p>
							<p className="mt-1 capitalize">{purchase.razorpayOrderStatus}</p>
						</div>
					)}
					<div>
						<p className="text-sm text-gray-600">Webhook Verified</p>
						<p className="mt-1">{purchase.webhookVerified ? 'Yes' : 'No'}</p>
					</div>
					{purchase.ipAddress && (
						<div>
							<p className="text-sm text-gray-600">IP Address</p>
							<p className="mt-1 font-mono text-sm">{purchase.ipAddress}</p>
						</div>
					)}
					{purchase.userAgent && (
						<div>
							<p className="text-sm text-gray-600">User Agent</p>
							<p className="mt-1 truncate text-sm">{purchase.userAgent}</p>
						</div>
					)}
					{renderPaymentMethodDetails()}
				</div>
			</CardContent>
		</Card>
	);
}

