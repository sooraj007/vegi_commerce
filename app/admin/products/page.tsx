import { getDb } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/products-table";
import Link from "next/link";

async function getProducts() {
  const db = await getDb();
  const products = await db
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
    .orderBy("p.created_at", "desc");

  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
