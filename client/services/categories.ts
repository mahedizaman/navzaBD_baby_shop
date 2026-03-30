import { api } from "./api";
import type { Category } from "./types";

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/api/categories");
  return data;
}

/** GET /api/categories/:id — public (read-only storefront). */
export async function getCategoryById(id: string): Promise<Category> {
  const { data } = await api.get<Category>(
    `/api/categories/${encodeURIComponent(id)}`,
  );
  return data;
}
