import { api } from "./api";
import { getBaseURL } from "./api";
import type { Category } from "./types";

function toAbsoluteImageUrl(rawImage?: string): string {
  if (!rawImage) return "";
  if (/^https?:\/\//i.test(rawImage)) return rawImage;
  const path = rawImage.startsWith("/") ? rawImage : `/uploads/${rawImage}`;
  return `${getBaseURL()}${path}`;
}

function normalizeCategory(item: Category): Category {
  const sourceImage = item.image || item.imgUrl || item.imageUrl || "";
  const image = toAbsoluteImageUrl(sourceImage);
  return {
    ...item,
    image,
    imgUrl: image,
    imageUrl: image,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/api/categories");
  return data.map(normalizeCategory);
}

/** GET /api/categories/:id — public (read-only storefront). */
export async function getCategoryById(id: string): Promise<Category> {
  const { data } = await api.get<Category>(
    `/api/categories/${encodeURIComponent(id)}`,
  );
  return normalizeCategory(data);
}
