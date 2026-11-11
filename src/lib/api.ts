export const API_BASE = process.env.ROUTE_API_BASE ?? "https://ecommerce.routemisr.com/api/v1";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  subcategory?: { _id: string; name: string; slug: string; category: string }[];
  category: { _id: string; name: string; slug: string; image: string };
  brand: { _id: string; name: string; slug: string; image: string };
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
}

interface ApiListResponse<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T[];
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json: ApiListResponse<Category> = await res.json();
  return json.data;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const json: ApiListResponse<Product> = await res.json();
  return json.data;
}
