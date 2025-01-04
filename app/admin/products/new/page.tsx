import { getDb } from "@/lib/db";
import ProductForm from "@/components/admin/product-form";

async function getCategories() {
  const db = await getDb();
  return await db
    .select("id", "name")
    .from("categories")
    .orderBy("name", "asc");
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Product</h1>
      <ProductForm
        categories={categories}
        initialData={{
          name: "",
          description: "",
          price: 0,
          stock: 0,
          category_id: null,
          images: [],
        }}
      />
    </div>
  );
}
