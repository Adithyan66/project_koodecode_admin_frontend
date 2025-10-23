import type { ProblemListItem } from '../types/problem';
import type { TableColumn } from './Table';

export const problemsTableColumns: TableColumn<ProblemListItem>[] = [
  {
    key: 'problemNumber',
    label: '#',
    sortable: true,
    className: 'font-mono'
  },
  {
    key: 'title',
    label: 'Title',
    sortable: true,
    className: 'text-slate-900 dark:text-slate-100 font-medium'
  },
  {
    key: 'difficulty',
    label: 'Difficulty',
    sortable: true,
    render: (value: string) => (
      <span className="capitalize">{value}</span>
    )
  },
  {
    key: 'acceptanceRate',
    label: 'Acceptance',
    sortable: true,
    render: (value: number) => `${value}%`
  },
  {
    key: 'totalSubmissions',
    label: 'Submissions',
    sortable: true,
    className: 'font-mono'
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleDateString(),
    className: 'text-slate-600 dark:text-slate-400'
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => (
      <span 
        className={`rounded px-2 py-1 text-xs ${
          value === 'active' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        {value}
      </span>
    )
  }
];
