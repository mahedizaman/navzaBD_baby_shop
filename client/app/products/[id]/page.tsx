import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/services/products";
import { ProductDetailView } from "@/components/shop/ProductDetailView";
import type { ProductDetailData } from "@/components/shop/ProductDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = (await getProductById(id)) as ProductDetailData;
    return {
      title: `${product.name} | NavzaBD Baby Shop`,
      description: product.description?.slice(0, 160),
    };
  } catch {
    return { title: "Product | NavzaBD Baby Shop" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  let product: ProductDetailData;
  try {
    product = (await getProductById(id)) as ProductDetailData;
  } catch {
    notFound();
  }
  return <ProductDetailView product={product} />;
}
