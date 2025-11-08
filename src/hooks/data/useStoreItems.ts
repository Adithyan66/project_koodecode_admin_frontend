import { useState, useEffect } from 'react';
import { fetchStoreItems, updateStoreItem, toggleStoreItemActive } from '../../api/store';
import type { StoreItem } from '../../types/storeItem';
import { usePagination } from '../utils/usePagination';
import { useSorting } from '../utils/useSorting';

interface UseStoreItemsResult {
  items: StoreItem[];
  loading: boolean;
  error: string | null;
  pagination: ReturnType<typeof usePagination>['state'];
  paginationActions: ReturnType<typeof usePagination>['actions'];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  handleSort: (column: string) => void;
  refetch: () => Promise<void>;
  updateItem: (itemId: string, updateData: any) => Promise<void>;
  toggleActive: (itemId: string) => Promise<void>;
}

export function useStoreItems(): UseStoreItemsResult {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const { state: paginationBase, actions: paginationActions } = usePagination({
    initialPage: 1,
    initialLimit: 10,
    totalCount,
  });

  const pagination = {
    ...paginationBase,
    totalCount,
  };

  const { state: sortingState, actions: sortingActions } = useSorting({
    initialSortBy: 'createdAt',
    initialSortOrder: 'desc',
  });

  const { sortBy, sortOrder } = sortingState;
  const { handleSort } = sortingActions;

  const fetchStoreItemsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchStoreItems(pagination.page, pagination.limit);
      setItems(response.data.items);
      setTotalCount(response.data.pagination.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch store items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: string, updateData: any) => {
    try {
      const response = await updateStoreItem(itemId, updateData);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? response.data : item))
      );
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Failed to update store item');
    }
  };

  const toggleActive = async (itemId: string) => {
    try {
      const response = await toggleStoreItemActive(itemId);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? response.data : item))
      );
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Failed to toggle store item');
    }
  };

  useEffect(() => {
    fetchStoreItemsData();
  }, [pagination.page, pagination.limit, sortBy, sortOrder]);

  return {
    items,
    loading,
    error,
    pagination,
    paginationActions,
    sortBy,
    sortOrder,
    handleSort,
    refetch: fetchStoreItemsData,
    updateItem,
    toggleActive,
  };
}

