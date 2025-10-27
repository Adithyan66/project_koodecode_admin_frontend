import { useNavigate } from 'react-router-dom';
import Table, { type TableColumn } from '../components/Table';
import Input from '../components/Input';
import { Card } from '../components/Card';
import Pagination from '../components/Pagination';
import { useCoinPurchases } from '../hooks';
import type { CoinPurchase } from '../types/coinPurchase';
import { PurchaseStatus, PaymentMethod } from '../types/coinPurchase';

export default function CoinPurchases() {
	const navigate = useNavigate();

	const {
		purchases,
		stats,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		paymentMethodFilter,
		setPaymentMethodFilter,
		dateRangeFilter,
		setDateRangeFilter,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
	} = useCoinPurchases();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const formatCurrency = (amount: number, currency: string) => {
		return `₹${amount.toLocaleString('en-IN')} ${currency}`;
	};

	const getStatusBadge = (status: PurchaseStatus) => {
		const statusConfig = {
			[PurchaseStatus.COMPLETED]: {
				label: 'Completed',
				className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			},
			[PurchaseStatus.PENDING]: {
				label: 'Pending',
				className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			},
			[PurchaseStatus.FAILED]: {
				label: 'Failed',
				className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
			},
			[PurchaseStatus.CANCELLED]: {
				label: 'Cancelled',
				className: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
			},
			[PurchaseStatus.REFUNDED]: {
				label: 'Refunded',
				className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
			},
		};

		const config = statusConfig[status] || statusConfig[PurchaseStatus.PENDING];

		return (
			<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
				{config.label}
			</span>
		);
	};

	const getPaymentMethodLabel = (method: PaymentMethod) => {
		const labels = {
			[PaymentMethod.UPI]: 'UPI',
			[PaymentMethod.CARD]: 'Card',
			[PaymentMethod.NET_BANKING]: 'Net Banking',
			[PaymentMethod.WALLET]: 'Wallet',
			[PaymentMethod.EMI]: 'EMI',
		};
		return labels[method] || method;
	};

	const handleRowClick = (purchase: CoinPurchase) => {
		navigate(`/payments/${purchase.id}`);
	};

	const columns: TableColumn<CoinPurchase>[] = [
		{
			key: 'userEmail',
			label: 'User',
			render: (_, purchase) => (
				<div>
					<div className="font-medium">{purchase.userName}</div>
					<div className="text-xs text-slate-500">{purchase.userEmail}</div>
				</div>
			),
		},
		{
			key: 'coins',
			label: 'Coins',
			sortable: true,
			render: (value) => (
				<span className="font-medium">{value.toLocaleString('en-IN')}</span>
			),
		},
		{
			key: 'amount',
			label: 'Amount',
			sortable: true,
			render: (value, purchase) => (
				<span className="font-semibold">{formatCurrency(value, purchase.currency)}</span>
			),
		},
		{
			key: 'status',
			label: 'Status',
			render: (value) => getStatusBadge(value as PurchaseStatus),
		},
		{
			key: 'paymentMethod',
			label: 'Payment Method',
			render: (value) => (
				<span className="capitalize">{getPaymentMethodLabel(value as PaymentMethod)}</span>
			),
		},
		{
			key: 'externalOrderId',
			label: 'Order ID',
			render: (value) => (
				<span className="font-mono text-sm">{value}</span>
			),
		},
		{
			key: 'createdAt',
			label: 'Created At',
			sortable: true,
			render: (value) => formatDate(value),
		},
	];

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="mb-2 text-2xl font-bold">Coin Purchases</h1>
					<p className="text-slate-600 dark:text-slate-300">
						View and manage all coin purchase transactions.
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			{stats && (
				<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Total This Month
						</div>
						<div className="mt-2 text-2xl font-bold">{stats.totalPurchasesThisMonth}</div>
					</Card>
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Revenue This Month
						</div>
						<div className="mt-2 text-2xl font-bold">
							₹{stats.totalRevenueThisMonth.toLocaleString('en-IN')}
						</div>
					</Card>
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Pending
						</div>
						<div className="mt-2 text-2xl font-bold text-yellow-600">{stats.pendingPurchases}</div>
					</Card>
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Failed
						</div>
						<div className="mt-2 text-2xl font-bold text-red-600">{stats.failedPurchases}</div>
					</Card>
				</div>
			)}

			{/* Search Bar */}
			<div className="mb-4">
				<Input
					type="text"
					placeholder="Search by user email, order ID, payment ID..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>

			{/* Filters */}
			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="">All Status</option>
						<option value="pending">Pending</option>
						<option value="completed">Completed</option>
						<option value="failed">Failed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={paymentMethodFilter}
						onChange={(e) => setPaymentMethodFilter(e.target.value)}
					>
						<option value="">All Payment Methods</option>
						<option value="upi">UPI</option>
						<option value="card">Card</option>
						<option value="net_banking">Net Banking</option>
						<option value="wallet">Wallet</option>
						<option value="emi">EMI</option>
					</select>
				</div>
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={dateRangeFilter}
						onChange={(e) => setDateRangeFilter(e.target.value)}
					>
						<option value="this_month">This Month</option>
						<option value="last_month">Last Month</option>
						<option value="custom">Custom Range</option>
					</select>
				</div>
				{dateRangeFilter === 'custom' && (
					<div className="flex gap-2">
						<input
							type="date"
							className="flex-1 rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
						<input
							type="date"
							className="flex-1 rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
						/>
					</div>
				)}
			</div>

			{/* Helper message for incomplete date range */}
			{dateRangeFilter === 'custom' && (!startDate || !endDate) && (
				<div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
					Please select both start and end dates to view results.
				</div>
			)}

			{/* Purchases Table */}
			<Table
				data={purchases}
				columns={columns}
				loading={loading}
				error={error}
				onSort={handleSort}
				sortBy={sortBy}
				sortOrder={sortOrder}
				rowKey="id"
				onRowClick={handleRowClick}
			/>

			{/* Pagination */}
			{!loading && !error && purchases.length > 0 && (
				<Pagination
					pagination={pagination}
					paginationActions={paginationActions}
				/>
			)}
		</div>
	);
}

