import { getDb } from "@/lib/db";

async function getCategories() {
  const db = await getDb();
  return await db.select("*").from("categories").orderBy("name", "asc");
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <a
          href="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add Category
        </a>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Products</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: any) => (
              <tr key={category.id} className="border-b">
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">{category.product_count || 0}</td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`/admin/categories/${category.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
