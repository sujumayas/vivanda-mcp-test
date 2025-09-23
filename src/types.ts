export interface PageMeta {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  empty: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface Product {
  id: string;
  externalId?: string;
  sku?: string;
  ean?: string;
  name?: string;
  description?: string;
  images?: ProductImage[];
}

export interface ProductSearchResponse {
  page: PageMeta;
  items: Product[];
}

export interface StoreInfo {
  id: string;
  name: string;
  selected?: boolean;
}

export interface StoreListResponse {
  stores: StoreInfo[];
}
