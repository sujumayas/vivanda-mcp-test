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

export interface ProductPricing {
  regularPrice?: number | null;
  discount?: number | null;
  finalPrice?: number | null;
}

export interface Product {
  id: string;
  externalId?: string;
  sku?: string;
  ean?: string;
  name?: string;
  description?: string;
  images?: ProductImage[];
  brand?: string;
  pricing?: ProductPricing;
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

export interface CartTotals {
  subtotal?: number | null;
  discounts?: number | null;
  shipping?: number | null;
  taxes?: number | null;
  grandTotal?: number | null;
}

export interface CartItemProduct {
  id?: string;
  sku?: string;
  name?: string;
  externalId?: string;
  brand?: string;
}

export interface CartItemPricing {
  unitPrice?: number | null;
  totalPrice?: number | null;
  regularPrice?: number | null;
  discount?: number | null;
}

export interface CartItem {
  id?: string;
  quantity?: number | null;
  product?: CartItemProduct | null;
  notes?: string | null;
  pricing?: CartItemPricing | null;
  [key: string]: unknown;
}

export interface CartItemInput {
  productId?: string;
  sku?: string;
  quantity: number;
  unitPrice?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface CartDetails {
  id?: string;
  status?: string;
  storeId?: string;
  branchId?: string | null;
  totals?: CartTotals | null;
  items?: CartItem[];
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface CartItemPreview {
  id: string;
  sku: string | null;
  name: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
}

export interface CartToolResult {
  message: string;
  cart: CartDetails;
  preview: CartItemPreview[];
  addedItems: Array<{ input: CartItemInput; present: boolean }>;
  cartLink?: string;
  sessionToken?: string;
}
