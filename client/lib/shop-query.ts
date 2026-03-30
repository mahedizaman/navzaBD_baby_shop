export type ShopQuery = {
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
};

function getFirst(
  raw: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const v = raw[key];
  if (Array.isArray(v)) return v[0];
  return v;
}

export function parseShopSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ShopQuery {
  const g = (k: string) => getFirst(raw, k);
  const page = Math.max(1, parseInt(g("page") || "1", 10) || 1);
  const limitRaw = parseInt(g("limit") || "12", 10) || 12;
  const limit = Math.min(48, Math.max(1, limitRaw));
  const sortOrder = g("sortOrder") === "desc" ? "desc" : "asc";
  const search = g("search")?.trim() || undefined;
  const category = g("category")?.trim() || undefined;
  const brand = g("brand")?.trim() || undefined;
  const priceMinRaw = g("priceMin");
  const priceMaxRaw = g("priceMax");
  const priceMin =
    priceMinRaw !== undefined && priceMinRaw !== ""
      ? Number(priceMinRaw)
      : undefined;
  const priceMax =
    priceMaxRaw !== undefined && priceMaxRaw !== ""
      ? Number(priceMaxRaw)
      : undefined;

  return {
    page,
    limit,
    sortOrder,
    search,
    category,
    brand,
    priceMin:
      priceMin !== undefined && !Number.isNaN(priceMin) ? priceMin : undefined,
    priceMax:
      priceMax !== undefined && !Number.isNaN(priceMax) ? priceMax : undefined,
  };
}

export function shopQueryToProductParams(q: ShopQuery) {
  return {
    page: q.page,
    limit: q.limit,
    sortOrder: q.sortOrder,
    search: q.search,
    category: q.category,
    brand: q.brand,
    priceMin: q.priceMin,
    priceMax: q.priceMax,
  };
}
