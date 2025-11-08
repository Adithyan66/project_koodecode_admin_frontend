import Table, { type TableColumn } from '../components/Table';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { Card } from '../components/Card';
import Pagination from '../components/Pagination';
import { useSubmissions } from '../hooks';
import type { Submission } from '../types/submission';
import { SubmissionStatus, SubmissionType } from '../types/submission';

export default function Submissions() {
    const navigate = useNavigate();
	const {
		submissions,
		summary,
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
		submissionTypeFilter,
		setSubmissionTypeFilter,
		dateRangeFilter,
		setDateRangeFilter,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
	} = useSubmissions();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const formatExecutionTime = (ms: number) => {
		if (ms < 1000) return `${ms}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	};

	const formatMemory = (bytes: number) => {
		if (bytes < 1024) return `${bytes}B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
	};

	const getStatusBadge = (status: string) => {
		const statusConfig: Record<string, { label: string; className: string }> = {
			[SubmissionStatus.ACCEPTED]: {
				label: 'Accepted',
				className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			},
			[SubmissionStatus.REJECTED]: {
				label: 'Rejected',
				className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
			},
			[SubmissionStatus.ERROR]: {
				label: 'Error',
				className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
			},
			[SubmissionStatus.PENDING]: {
				label: 'Pending',
				className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			},
			[SubmissionStatus.PROCESSING]: {
				label: 'Processing',
				className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			},
			[SubmissionStatus.TIME_LIMIT_EXCEEDED]: {
				label: 'Time Limit Exceeded',
				className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
			},
			[SubmissionStatus.MEMORY_LIMIT_EXCEEDED]: {
				label: 'Memory Limit Exceeded',
				className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
			},
			[SubmissionStatus.COMPILATION_ERROR]: {
				label: 'Compilation Error',
				className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
			},
		};

		const config = statusConfig[status] || {
			label: status,
			className: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
		};

		return (
			<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
				{config.label}
			</span>
		);
	};

	const getTypeBadge = (type: string) => {
		const isProblem = type === SubmissionType.PROBLEM;
		return (
			<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
				isProblem
					? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
					: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
			}`}>
				{isProblem ? 'Problem' : 'Contest'}
			</span>
		);
	};

	const columns: TableColumn<Submission>[] = [
		{
			key: 'user',
			label: 'User',
			render: (_, submission) => (
				<div>
					<div className="font-medium">{submission.user.username}</div>
					<div className="text-xs text-slate-500">{submission.user.email}</div>
				</div>
			),
		},
		{
			key: 'problem',
			label: 'Problem',
			render: (_, submission) => (
				<div>
					<div className="font-medium">{submission.problem.title}</div>
					<div className="text-xs text-slate-500">{submission.problem.slug}</div>
				</div>
			),
		},
		{
			key: 'language',
			label: 'Language',
			render: (_, submission) => (
				<span className="font-medium">{submission.language.name}</span>
			),
		},
		{
			key: 'status',
			label: 'Status',
			render: (_, submission) => getStatusBadge(submission.status),
		},
		{
			key: 'score',
			label: 'Score',
			sortable: true,
			render: (value) => (
				<span className="font-medium">{value}%</span>
			),
		},
		{
			key: 'testCases',
			label: 'Test Cases',
			render: (_, submission) => (
				<span className="font-medium">
					{submission.testCasesPassed}/{submission.totalTestCases}
				</span>
			),
		},
		{
			key: 'totalExecutionTime',
			label: 'Execution Time',
			sortable: true,
			render: (value) => (
				<span className="font-mono text-sm">{formatExecutionTime(value)}</span>
			),
		},
		{
			key: 'maxMemoryUsage',
			label: 'Memory',
			sortable: true,
			render: (value) => (
				<span className="font-mono text-sm">{formatMemory(value)}</span>
			),
		},
		{
			key: 'submissionType',
			label: 'Type',
			render: (_, submission) => getTypeBadge(submission.submissionType),
		},
		{
			key: 'createdAt',
			label: 'Submitted At',
			sortable: true,
			render: (value) => formatDate(value),
		},
	];

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="mb-2 text-2xl font-bold">Submissions</h1>
					<p className="text-slate-600 dark:text-slate-300">
						View and manage all code submissions.
					</p>
				</div>
			</div>

			{summary && (
				<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Total Submissions
						</div>
						<div className="mt-2 text-2xl font-bold">{summary.totalSubmissions.toLocaleString()}</div>
					</Card>
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Accepted
						</div>
						<div className="mt-2 text-2xl font-bold text-green-600">{summary.acceptedCount.toLocaleString()}</div>
					</Card>
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Rejected
						</div>
						<div className="mt-2 text-2xl font-bold text-red-600">{summary.rejectedCount.toLocaleString()}</div>
					</Card>
					<Card>
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Pending
						</div>
						<div className="mt-2 text-2xl font-bold text-yellow-600">{summary.pendingCount.toLocaleString()}</div>
					</Card>
				</div>
			)}

			<div className="mb-4">
				<Input
					type="text"
					placeholder="Search by userId or problemId..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>

			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="">All Status</option>
						<option value="pending">Pending</option>
						<option value="processing">Processing</option>
						<option value="accepted">Accepted</option>
						<option value="rejected">Rejected</option>
						<option value="error">Error</option>
						<option value="time_limit_exceeded">Time Limit Exceeded</option>
						<option value="memory_limit_exceeded">Memory Limit Exceeded</option>
						<option value="compilation_error">Compilation Error</option>
					</select>
				</div>
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={submissionTypeFilter}
						onChange={(e) => setSubmissionTypeFilter(e.target.value)}
					>
						<option value="">All Types</option>
						<option value="problem">Problem</option>
						<option value="contest">Contest</option>
					</select>
				</div>
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={dateRangeFilter}
						onChange={(e) => setDateRangeFilter(e.target.value)}
					>
						<option value="all">All Time</option>
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

			{dateRangeFilter === 'custom' && (!startDate || !endDate) && (
				<div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
					Please select both start and end dates to view results.
				</div>
			)}

			<Table
				data={submissions}
				columns={columns}
				loading={loading}
				error={error}
				onSort={handleSort}
				sortBy={sortBy}
				sortOrder={sortOrder}
				rowKey="id"
				onRowClick={(submission) => navigate(`/submissions/${submission.id}`)}
			/>

			{!loading && !error && submissions.length > 0 && (
				<Pagination
					pagination={pagination}
					paginationActions={paginationActions}
				/>
			)}
		</div>
	);
}

