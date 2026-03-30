import { api } from "./api";
import type { ProductsListResponse } from "./types";

/**
 * Query params for GET /api/products (server: productController.getProducts).
 * - search: case-insensitive name match
 * - category / brand: Mongo ObjectId strings
 * - priceMin / priceMax: number filters on price
 */
export type ProductListParams = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
};

function buildSearchParams(params?: ProductListParams): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  const entries: [string, string | number | undefined][] = [
    ["page", params.page],
    ["limit", params.limit],
    ["sortOrder", params.sortOrder],
    ["category", params.category],
    ["brand", params.brand],
    ["priceMin", params.priceMin],
    ["priceMax", params.priceMax],
    ["search", params.search],
  ];
  for (const [key, value] of entries) {
    if (value === undefined || value === null || value === "") continue;
    sp.set(key, String(value));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export async function getProducts(
  params?: ProductListParams,
): Promise<ProductsListResponse> {
  const { data } = await api.get<ProductsListResponse>(
    `/api/products${buildSearchParams(params)}`,
  );
  return data;
}

export async function getProductById(id: string) {
  const { data } = await api.get(`/api/products/${encodeURIComponent(id)}`);
  return data;
}
