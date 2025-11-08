import { useState, useRef, useEffect } from 'react';
import Table, { type TableColumn } from '../components/Table';
import { Card } from '../components/Card';
import Pagination from '../components/Pagination';
import Toggle from '../components/Toggle';
import { useStoreItems } from '../hooks';
import type { StoreItem } from '../types/storeItem';

export default function StoreManagement() {
  const {
    items,
    loading,
    error,
    pagination,
    paginationActions,
    sortBy,
    sortOrder,
    handleSort,
    updateItem,
    toggleActive,
  } = useStoreItems();

  const [editingCell, setEditingCell] = useState<{ itemId: string; field: string; value: string } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleCellClick = (itemId: string, field: string, value: string | number) => {
    if (field === 'price' || field === 'description' || field === 'imageUrl') {
      setEditingCell({ itemId, field, value: String(value) });
      setEditError(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingCell) return;

    const { itemId, field, value } = editingCell;
    
    if (field === 'price') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        setEditError('Price must be greater than or equal to 0');
        return;
      }
    }

    if (field === 'description' && !value.trim()) {
      setEditError('Description cannot be empty');
      return;
    }

    if (field === 'imageUrl' && !value.trim()) {
      setEditError('Image URL cannot be empty');
      return;
    }

    try {
      const updateData: any = { [field]: field === 'price' ? parseFloat(value) : value };
      await updateItem(itemId, updateData);
      setEditingCell(null);
      setEditError(null);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update item');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleToggleChange = async (item: StoreItem) => {
    try {
      await toggleActive(item.id);
    } catch (err: any) {
      console.error('Failed to toggle item:', err);
    }
  };

  const renderEditableCell = (item: StoreItem, field: string, value: string | number, isMultiline = false) => {
    const isEditing = editingCell?.itemId === item.id && editingCell?.field === field;

    if (isEditing) {
      return (
        <div className="relative">
          {isMultiline ? (
            <textarea
              ref={inputRef as any}
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full rounded-md border border-blue-500 bg-white px-2 py-1 text-sm dark:bg-slate-900"
              rows={2}
            />
          ) : (
            <input
              ref={inputRef as any}
              type={field === 'price' ? 'number' : 'text'}
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              className="w-full rounded-md border border-blue-500 bg-white px-2 py-1 text-sm dark:bg-slate-900"
              min={field === 'price' ? 0 : undefined}
            />
          )}
          {editError && editingCell.itemId === item.id && editingCell.field === field && (
            <div className="absolute left-0 top-full mt-1 rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900 dark:text-red-200">
              {editError}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        onClick={() => handleCellClick(item.id, field, value)}
        className="cursor-pointer rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        {field === 'price' && typeof value === 'number' ? (
          <span className="font-medium">{value.toLocaleString()}</span>
        ) : (
          <span className="text-sm">{value || '-'}</span>
        )}
      </div>
    );
  };

  const columns: TableColumn<StoreItem>[] = [
    {
      key: 'imageUrl',
      label: 'Image',
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value as string}
              alt=""
              className="h-12 w-12 rounded object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-200 text-xs text-slate-500 dark:bg-slate-700">
              No Image
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {value}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value, item) => renderEditableCell(item, 'price', value),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value, item) => renderEditableCell(item, 'description', value, true),
      className: 'max-w-md',
    },
    // {
    //   key: 'imageUrl',
    //   label: 'Image URL',
    //   render: (value, item) => renderEditableCell(item, 'imageUrl', value),
    //   className: 'max-w-md',
    // },
    {
      key: 'isActive',
      label: 'Active',
      render: (value, item) => (
        <Toggle
          checked={value as boolean}
          onChange={() => handleToggleChange(item)}
        />
      ),
    },
  ];

  const activeItems = items.filter((item) => item.isActive).length;
  const inactiveItems = items.filter((item) => !item.isActive).length;
  const totalRevenue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Store Management</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage store items, prices, and availability.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Active Items
          </div>
          <div className="mt-2 text-2xl font-bold text-green-600">{activeItems}</div>
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Inactive Items
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-600">{inactiveItems}</div>
        </Card>
        <Card>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Items Value
          </div>
          <div className="mt-2 text-2xl font-bold">{totalRevenue.toLocaleString()} coins</div>
        </Card>
      </div>

      <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
        Click on Price, Description, or Image URL to edit. Press Enter to save or Escape to cancel.
      </div>

      <Table
        data={items}
        columns={columns}
        loading={loading}
        error={error}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        rowKey="id"
      />

      {!loading && !error && items.length > 0 && (
        <Pagination
          pagination={pagination}
          paginationActions={paginationActions}
        />
      )}
    </div>
  );
}

