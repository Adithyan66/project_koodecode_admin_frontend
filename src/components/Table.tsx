import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  rowKey?: keyof T | string | ((item: T) => string | number);
  className?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export default function Table<T>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = 'No data found',
  onRowClick,
  sortBy,
  sortOrder = 'asc',
  onSort,
  rowKey = 'id',
  className = '',
  loadingComponent,
  errorComponent,
  emptyComponent
}: TableProps<T>) {
  const getRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(item);
    }
    return (item as any)[rowKey] || index;
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortBy || sortBy !== columnKey || !onSort) return '';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key as string);
    }
  };

  const renderCell = (column: TableColumn<T>, item: T) => {
    if (column.render) {
      return column.render((item as any)[column.key], item);
    }
    return (item as any)[column.key];
  };

  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 ${className}`}>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={`px-4 py-3 ${
                  column.sortable && onSort
                    ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900'
                    : ''
                } ${column.headerClassName || ''}`}
                onClick={() => column.sortable && onSort && handleSort(column)}
              >
                <div className="flex items-center gap-1">
                  <span>{column.label}</span>
                  {column.sortable && onSort && (
                    <span className="text-xs">{getSortIcon(column.key as string)}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6">
                {loadingComponent || (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                    <span className="ml-2 text-slate-600">Loading...</span>
                  </div>
                )}
              </td>
            </tr>
          )}
          
          {!loading && error && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-red-600 text-center">
                {errorComponent || error}
              </td>
            </tr>
          )}
          
          {!loading && !error && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-slate-500">
                {emptyComponent || emptyMessage}
              </td>
            </tr>
          )}
          
          {!loading && !error && data.map((item, index) => (
            <tr
              key={getRowKey(item, index)}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800' : ''
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key as string}
                  className={`px-4 py-3 ${column.className || ''}`}
                >
                  {renderCell(column, item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
