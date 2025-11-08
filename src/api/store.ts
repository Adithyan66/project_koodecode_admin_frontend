import axiosInstance from './axios';
import type { StoreItemsResponse, UpdateStoreItemData, UpdateStoreItemResponse } from '../types/storeItem';

export async function fetchStoreItems(page: number = 1, limit: number = 10): Promise<StoreItemsResponse> {
  const { data } = await axiosInstance.get<StoreItemsResponse>('/admin/store/items', {
    params: { page, limit },
  });
  return data;
}

export async function updateStoreItem(itemId: string, updateData: UpdateStoreItemData): Promise<UpdateStoreItemResponse> {
  const { data } = await axiosInstance.patch<UpdateStoreItemResponse>(
    `/admin/store/${itemId}`,
    updateData
  );
  return data;
}

export async function toggleStoreItemActive(itemId: string): Promise<UpdateStoreItemResponse> {
  const { data } = await axiosInstance.patch<UpdateStoreItemResponse>(
    `/admin/store/${itemId}/toggle-active`
  );
  return data;
}

