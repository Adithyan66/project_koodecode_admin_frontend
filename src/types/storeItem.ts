export interface StoreItem {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  componentId: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoreItemsResponse {
  success: boolean;
  message: string;
  data: {
    items: StoreItem[];
    pagination: PaginationData;
  };
}

export interface UpdateStoreItemData {
  price?: number;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateStoreItemResponse {
  success: boolean;
  message: string;
  data: StoreItem;
}

