import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import ProductForm from "@/components/admin/product-form";

interface Category {
  id: string;
  name: string;
}

async function getProduct(id: string) {
  if (!id) return null;

  const db = await getDb();
  const product = await db
    .select(
      "p.*",
      "c.name as category_name",
      db.raw(`
        (
          SELECT json_agg(json_build_object(
            'id', pi.id,
            'image_url', pi.image_url,
            'is_primary', pi.is_primary
          ))
          FROM product_images pi
          WHERE pi.product_id = p.id
        ) as images
      `)
    )
    .from("products as p")
    .leftJoin("categories as c", "p.category_id", "c.id")
    .where("p.id", id)
    .first();

  return product;
}

async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  return await db
    .select("id", "name")
    .from("categories")
    .orderBy("name", "asc");
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let productData;
  let categoriesData;

  try {
    [productData, categoriesData] = await Promise.all([
      getProduct(id),
      getCategories(),
    ]);

    if (!productData) {
      notFound();
    }

    return (
      <ProductForm categories={categoriesData} initialData={productData} />
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
