/** Matches server product list response (populated category & brand). */
export type ProductListItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number;
  /** Mongoose virtual when API sends JSON with virtuals */
  finalPrice?: number;
  stock: number;
  image: string;
  averageRating?: number;
  category: { _id: string; name: string } | string;
  brand: { _id: string; name: string } | string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsListResponse = {
  products: ProductListItem[];
  total: number;
};

export type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  categoryType?: string;
};

export type Brand = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
};
