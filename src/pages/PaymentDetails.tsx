import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { useCoinPurchaseDetail } from '../hooks';
import {
	UserInfoCard,
	PurchaseInfoCard,
	TechnicalDetailsCard,
	ReconciliationNotesCard,
	ActionsSection,
	StaleWarningBanner,
	NotesHistoryCard,
} from '../components/admin/coinpaymentdetails';

export default function PaymentDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const {
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
		refetch,
	} = useCoinPurchaseDetail(id!);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading purchase details...</p>
				</div>
			</div>
		);
	}

	if (error || !purchase || !user) {
		return (
			<div className="flex items-center justify-center py-12">
				<Card className="max-w-md">
					<CardContent className="flex items-center gap-3 p-6 text-red-600">
						<XCircle className="h-6 w-6" />
						<div>
							<h3 className="font-semibold">Error Loading Purchase</h3>
							<p className="text-sm">{error || 'Purchase not found'}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Action Buttons */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate('/payments')}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					>
						<ArrowLeft className="h-5 w-5" />
						Back to Payments
					</button>
					<div>
						<h1 className="text-2xl font-bold">Purchase Details</h1>
						<p className="text-slate-600 dark:text-slate-300">Transaction ID: {purchase.id}</p>
					</div>
				</div>
				
				<div className="flex items-center gap-2">
					<ActionsSection
						purchase={purchase}
						canReconcile={canReconcile}
						actionLoading={actionLoading}
						onReconcile={handleReconcile}
						onCancel={handleCancel}
						onMarkAsFailed={handleMarkAsFailed}
						onSendReminder={handleSendReminder}
						onNotifySuccess={handleNotifySuccess}
						onNotifyFailure={handleNotifyFailure}
						onAddNotes={handleAddNotes}
						onProcessRefund={handleProcessRefund}
					/>
					<button
						onClick={refetch}
						disabled={actionLoading}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						<RefreshCw className={`h-4 w-4 ${actionLoading ? 'animate-spin' : ''}`} />
						Refresh
					</button>
				</div>
			</div>

			{/* Stale Warning */}
			<StaleWarningBanner isStale={isStale} />

			{/* Action Error Banner */}
			{actionError && (
				<Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
					<CardContent className="flex items-center gap-3 p-4 text-red-600">
						<XCircle className="h-5 w-5" />
						<p>{actionError}</p>
					</CardContent>
				</Card>
			)}

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left Column - User Info */}
				<div className="lg:col-span-1">
					<UserInfoCard user={user} />
				</div>

				{/* Middle Column - Purchase Details */}
				<div className="lg:col-span-2">
					<PurchaseInfoCard purchase={purchase} />
				</div>
			</div>

			{/* Technical Details and Activity Notes */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<TechnicalDetailsCard purchase={purchase} />
				<NotesHistoryCard notes={purchase.notes} />
			</div>

			{/* Reconciliation Notes */}
			<ReconciliationNotesCard notes={purchase.reconciliationNotes} />
		</div>
	);
}

