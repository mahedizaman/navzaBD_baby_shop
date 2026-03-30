import { api } from "./api";
import type { Brand } from "./types";

export async function getBrands(): Promise<Brand[]> {
  const { data } = await api.get<Brand[]>("/api/brands");
  return data;
}

export async function getBrandById(id: string): Promise<Brand> {
  const { data } = await api.get<Brand>(
    `/api/brands/${encodeURIComponent(id)}`,
  );
  return data;
}
