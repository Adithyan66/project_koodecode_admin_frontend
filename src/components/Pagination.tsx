interface PaginationProps {
	pagination: {
		page: number;
		totalPages: number;
		totalCount: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startIndex: number;
		endIndex: number;
	};
	paginationActions: {
		goToFirstPage: () => void;
		goToPreviousPage: () => void;
		goToNextPage: () => void;
		goToLastPage: () => void;
	};
	showFirstLast?: boolean;
}

export default function Pagination({
	pagination,
	paginationActions,
	showFirstLast = true,
}: PaginationProps) {
	return (
		<div className="mt-4 flex items-center justify-between">
			<div className="text-sm text-slate-600 dark:text-slate-400">
				Showing {pagination.startIndex + 1} to{' '}
				{Math.min(pagination.endIndex + 1, pagination.totalCount)} of{' '}
				{pagination.totalCount} results
			</div>
			<div className="flex items-center gap-2">
				{showFirstLast && (
					<button
						onClick={() => paginationActions.goToFirstPage()}
						disabled={!pagination.hasPreviousPage}
						className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
					>
						First
					</button>
				)}
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
				{showFirstLast && (
					<button
						onClick={() => paginationActions.goToLastPage()}
						disabled={!pagination.hasNextPage}
						className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
					>
						Last
					</button>
				)}
			</div>
		</div>
	);
}

