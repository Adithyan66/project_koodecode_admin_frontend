import { useNavigate } from 'react-router-dom';
import Table, { type TableColumn } from '../components/Table';
import Input from '../components/Input';
import { useUsers } from '../hooks/data/useUsers';
import type { User } from '../types/user';

export default function Users() {
	const navigate = useNavigate();
	
	const {
		users,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
	} = useUsers();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	const handleRowClick = (user: User) => {
		navigate(`/users/${user.id}`);
	};

	const columns: TableColumn<User>[] = [
		{
			key: 'fullName',
			label: 'Full Name',
			sortable: true,
		},
		{
			key: 'userName',
			label: 'Username',
			sortable: true,
		},
		{
			key: 'email',
			label: 'Email',
			sortable: true,
		},
		{
			key: 'provider',
			label: 'Provider',
			render: (value) => (
				<span className="capitalize">{value}</span>
			),
		},
		{
			key: 'emailVerified',
			label: 'Verified',
			render: (value) => (
				<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
					value
						? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
						: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
				}`}>
					{value ? 'Verified' : 'Not Verified'}
				</span>
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
					<h1 className="mb-2 text-2xl font-bold">Users</h1>
					<p className="text-slate-600 dark:text-slate-300">
						Manage platform users here.
					</p>
				</div>
			</div>

			{/* Search Bar */}
			<div className="mb-4">
				<Input
					type="text"
					placeholder="Search by name, username, or email..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>

			{/* Users Table */}
			<Table
				data={users}
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
			{!loading && !error && users.length > 0 && (
				<div className="mt-4 flex items-center justify-between">
					<div className="text-sm text-slate-600 dark:text-slate-400">
						Showing {pagination.startIndex + 1} to{' '}
						{Math.min(pagination.endIndex + 1, pagination.totalCount)} of{' '}
						{pagination.totalCount} results
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => paginationActions.goToFirstPage()}
							disabled={!pagination.hasPreviousPage}
							className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
						>
							First
						</button>
						<button
							onClick={() => paginationActions.goToPreviousPage()}
							disabled={!pagination.hasPreviousPage}
							className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
						>
							Previous
						</button>
						<span className="text-sm text-slate-700 dark:text-slate-300">
							Page {pagination.page} of {pagination.totalPages}
						</span>
						<button
							onClick={() => paginationActions.goToNextPage()}
							disabled={!pagination.hasNextPage}
							className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
						>
							Next
						</button>
						<button
							onClick={() => paginationActions.goToLastPage()}
							disabled={!pagination.hasNextPage}
							className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
						>
							Last
						</button>
					</div>
				</div>
			)}
		</div>
	);
}


