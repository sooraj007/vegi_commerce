import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import ProductForm from "@/components/admin/product-form";

async function getProduct(id: string) {
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

async function getCategories() {
  const db = await getDb();
  return await db
    .select("id", "name")
    .from("categories")
    .orderBy("name", "asc");
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
