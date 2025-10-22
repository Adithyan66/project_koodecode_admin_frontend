import Input from '../components/Input';
import Button from '../components/Button';
import Table from '../components/Table';
import { problemsTableColumns } from '../components/ProblemsTableConfig';
import { useNavigate } from 'react-router-dom';
import GlobalLoadingOverlay from '../components/GlobalLoadingOverlay';
import { useProblemsData } from '../hooks';

export default function Problems() {
	const navigate = useNavigate();
	const {
		state: { items, totalCount, error, loading },
		filters,
		pagination,
		sorting,
	} = useProblemsData();

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-2">
				<h1 className="text-2xl font-bold">Problems</h1>
				<Button onClick={() => navigate('/problems/create')}>Create Problem</Button>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-4">
				<div className="md:col-span-2">
					<Input 
						placeholder="Search by number or title" 
						value={filters.state.search} 
						onChange={(e) => filters.actions.setFilter('search', e.target.value)} 
					/>
				</div>
				<div>
					<select 
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900" 
						value={filters.state.difficulty} 
						onChange={(e) => filters.actions.setFilter('difficulty', e.target.value as any)}
					>
						<option value="">All difficulties</option>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>
				<div>
					<select 
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900" 
						value={filters.state.status} 
						onChange={(e) => filters.actions.setFilter('status', e.target.value as any)}
					>
						<option value="">All status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>

			<Table
				data={items}
				columns={problemsTableColumns}
				loading={loading}
				error={error}
				sortBy={sorting.state.sortBy}
				sortOrder={sorting.state.sortOrder}
				onSort={(column) => sorting.actions.handleSort(column as any)}
				onRowClick={(problem) => navigate(`/problems/${problem.slug}`)}
				loadingComponent={<GlobalLoadingOverlay />}
				emptyMessage="No problems found"
			/>

			<div className="flex items-center justify-between">
				<div className="text-sm text-slate-600 dark:text-slate-300">Total: {totalCount}</div>
				<div className="flex items-center gap-2">
					<Button 
						variant="secondary" 
						onClick={pagination.actions.goToPreviousPage} 
						disabled={!pagination.state.hasPreviousPage}
					>
						Prev
					</Button>
					<div className="text-sm">Page {pagination.state.page} / {pagination.state.totalPages}</div>
					<Button 
						variant="secondary" 
						onClick={pagination.actions.goToNextPage} 
						disabled={!pagination.state.hasNextPage}
					>
						Next
					</Button>
					<select 
						className="rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900" 
						value={pagination.state.limit} 
						onChange={(e) => pagination.actions.setLimit(parseInt(e.target.value))}
					>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
					</select>
				</div>
			</div>
		</div>
	);
}


