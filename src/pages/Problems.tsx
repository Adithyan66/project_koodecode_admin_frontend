import { useEffect, useMemo, useState } from 'react';
import { fetchProblems } from '../api/problems';
import type { ProblemsQuery, ProblemListItem, ProblemsSortBy, SortOrder, Difficulty, ProblemStatus } from '../types/problem';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Problems() {
	const navigate = useNavigate();
	const [items, setItems] = useState<ProblemListItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [sortBy, setSortBy] = useState<ProblemsSortBy>('problemNumber');
	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
	const [search, setSearch] = useState('');
	const [difficulty, setDifficulty] = useState<'' | Difficulty>('');
	const [status, setStatus] = useState<'' | ProblemStatus>('');

	const query = useMemo<ProblemsQuery>(
		() => ({ search, difficulty, status, page, limit, sortBy, sortOrder }),
		[search, difficulty, status, page, limit, sortBy, sortOrder],
	);

	useEffect(() => {
		let active = true;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetchProblems(query);
				if (!active) return;
				setItems(res.data.problems);
				setTotalCount(res.data.pagination.totalCount);
			} catch (err: any) {
				if (!active) return;
				setError(err?.response?.data?.message || err?.message || 'Failed to load problems');
			} finally {
				if (active) setLoading(false);
			}
		})();
		return () => {
			active = false;
		};
	}, [query]);

	const totalPages = Math.max(1, Math.ceil(totalCount / limit));

	function handleSort(col: ProblemsSortBy) {
		if (sortBy === col) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(col);
			setSortOrder('asc');
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-2">
				<h1 className="text-2xl font-bold">Problems</h1>
				<Button onClick={() => navigate('/problems/create')}>Create Problem</Button>
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-4">
				<div className="md:col-span-2">
					<Input placeholder="Search by number or title" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
				</div>
				<div>
					<select className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={difficulty} onChange={(e) => { setPage(1); setDifficulty(e.target.value as any); }}>
						<option value="">All difficulties</option>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>
				<div>
					<select className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as any); }}>
						<option value="">All status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>

			<div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
				<table className="min-w-full text-left text-sm">
					<thead className="bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
						<tr>
							<th className="cursor-pointer px-4 py-3" onClick={() => handleSort('problemNumber')}># {sortBy==='problemNumber' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
							<th className="cursor-pointer px-4 py-3" onClick={() => handleSort('title')}>Title {sortBy==='title' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
							<th className="cursor-pointer px-4 py-3" onClick={() => handleSort('difficulty')}>Difficulty {sortBy==='difficulty' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
							<th className="cursor-pointer px-4 py-3" onClick={() => handleSort('acceptanceRate')}>Acceptance {sortBy==='acceptanceRate' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
							<th className="cursor-pointer px-4 py-3" onClick={() => handleSort('totalSubmissions')}>Submissions {sortBy==='totalSubmissions' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
							<th className="cursor-pointer px-4 py-3" onClick={() => handleSort('createdAt')}>Created {sortBy==='createdAt' ? (sortOrder==='asc'?'↑':'↓') : ''}</th>
							<th className="px-4 py-3">Status</th>
						</tr>
					</thead>
					<tbody>
						{loading && (
							<tr><td className="px-4 py-6" colSpan={7}>Loading...</td></tr>
						)}
						{!loading && error && (
							<tr><td className="px-4 py-6 text-red-600" colSpan={7}>{error}</td></tr>
						)}
						{!loading && !error && items.length === 0 && (
							<tr><td className="px-4 py-6" colSpan={7}>No problems found</td></tr>
						)}
						{!loading && !error && items.map((p) => (
							<tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => navigate(`/problems/${p.slug}`)}>
								<td className="px-4 py-3">{p.problemNumber}</td>
								<td className="px-4 py-3 text-slate-900 dark:text-slate-100">{p.title}</td>
								<td className="px-4 py-3 capitalize">{p.difficulty}</td>
								<td className="px-4 py-3">{p.acceptanceRate}%</td>
								<td className="px-4 py-3">{p.totalSubmissions}</td>
								<td className="px-4 py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
								<td className="px-4 py-3">
									<span className={`rounded px-2 py-1 text-xs ${p.status==='active'?'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300':'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>{p.status}</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between">
				<div className="text-sm text-slate-600 dark:text-slate-300">Total: {totalCount}</div>
				<div className="flex items-center gap-2">
					<Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page<=1}>Prev</Button>
					<div className="text-sm">Page {page} / {totalPages}</div>
					<Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page>=totalPages}>Next</Button>
					<select className="rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900" value={limit} onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value)); }}>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
					</select>
				</div>
			</div>
		</div>
	);
}


