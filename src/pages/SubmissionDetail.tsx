import { useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import Table, { type TableColumn } from '../components/Table';
import { useSubmissionDetail } from '../hooks/data/useSubmissionDetail';
import type { SubmissionTestCaseResult } from '../types/submissionDetail';

export default function SubmissionDetail() {
	const { submissionId } = useParams();
	const { data, loading, error } = useSubmissionDetail(submissionId || '');

	const columns: TableColumn<SubmissionTestCaseResult>[] = [
		{ key: 'testCaseId', label: 'Test Case' },
		{ key: 'status', label: 'Status', render: (value) => (
			<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
				value === 'passed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
				value === 'failed' || value === 'error' || value === 'compilation_error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
				value === 'time_limit_exceeded' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
				value === 'memory_limit_exceeded' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
				'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
			}`}>
				{String(value).replace(/_/g, ' ')}
			</span>
		)},
		{ key: 'executionTime', label: 'Time', render: (v) => v ? `${v}ms` : '-' },
		{ key: 'memoryUsage', label: 'Memory', render: (v) => v ? `${(v / (1024 * 1024)).toFixed(2)}MB` : '-' },
		{ key: 'judge0Token', label: 'Judge0 Token', render: (v) => v ? <span className="font-mono text-xs">{v}</span> : '-' },
		{ key: 'errorMessage', label: 'Error', render: (v) => v ? <span title={v} className="line-clamp-1 max-w-xs text-xs">{v}</span> : '-' },
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600" />
				<span className="ml-2 text-slate-600">Loading...</span>
			</div>
		);
	}

	if (error) {
		return <div className="text-center text-red-600">{error}</div>;
	}

	if (!data) {
		return <div className="text-center text-slate-600">No data</div>;
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="mb-1 text-2xl font-bold">Submission Detail</h1>
				<p className="text-slate-600 dark:text-slate-300">{data.user.username} · {data.problem.title}</p>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card>
					<div className="text-sm text-slate-600 dark:text-slate-400">Status / Verdict</div>
					<div className="mt-2 text-lg font-semibold">{data.status}</div>
					<div className="text-sm text-slate-500">{data.overallVerdict}</div>
				</Card>
				<Card>
					<div className="text-sm text-slate-600 dark:text-slate-400">Score</div>
					<div className="mt-2 text-2xl font-bold">{data.score}%</div>
				</Card>
				<Card>
					<div className="text-sm text-slate-600 dark:text-slate-400">Exec Time (total/avg)</div>
					<div className="mt-2 text-lg font-semibold">{data.performanceMetrics.totalExecutionTime}ms / {data.performanceMetrics.averageExecutionTime}ms</div>
				</Card>
				<Card>
					<div className="text-sm text-slate-600 dark:text-slate-400">Memory (max/avg)</div>
					<div className="mt-2 text-lg font-semibold">{(data.performanceMetrics.maxMemoryUsage / (1024*1024)).toFixed(2)}MB / {(data.performanceMetrics.averageMemoryUsage / (1024*1024)).toFixed(2)}MB</div>
				</Card>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Card>
					<div className="mb-2 text-sm font-semibold">Source Code ({data.language.name})</div>
					<pre className="max-h-96 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
						<code>{data.sourceCode}</code>
					</pre>
				</Card>
				<div className="space-y-4">
					<Card>
						<div className="text-sm font-semibold">Problem</div>
						<div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{data.problem.title} ({data.problem.slug})</div>
						<div className="text-xs text-slate-500">Difficulty: {data.problem.difficulty}{typeof data.problem.problemNumber === 'number' ? ` · #${data.problem.problemNumber}` : ''}</div>
					</Card>
					<Card>
						<div className="text-sm font-semibold">User</div>
						<div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{data.user.fullName || data.user.username}</div>
						<div className="text-xs text-slate-500">{data.user.email}</div>
					</Card>
					<Card>
						<div className="text-sm font-semibold">Metadata</div>
						<div className="mt-1 text-xs text-slate-600 dark:text-slate-300">Type: {data.submissionType}</div>
						<div className="text-xs text-slate-600 dark:text-slate-300">Created: {new Date(data.createdAt).toLocaleString()}</div>
						<div className="text-xs text-slate-600 dark:text-slate-300">Updated: {new Date(data.updatedAt).toLocaleString()}</div>
						{data.judge0Token && (
							<div className="text-xs text-slate-600 dark:text-slate-300">Judge0 Token: <span className="font-mono">{data.judge0Token}</span></div>
						)}
					</Card>
				</div>
			</div>

			<div>
				<div className="mb-2 text-sm font-semibold">Test Cases</div>
				<Table data={data.testCaseResults} columns={columns} rowKey={(r) => r.testCaseId} />
			</div>
		</div>
	);
}
