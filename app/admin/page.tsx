import { getDb } from "@/lib/db";

async function getDashboardStats() {
  const db = await getDb();

  const [totalProducts, totalCategories, recentProducts] = await Promise.all([
    db.count("* as count").from("products").first(),
    db.count("* as count").from("categories").first(),
    db.select("*").from("products").orderBy("created_at", "desc").limit(5),
  ]);

  return {
    totalProducts: Number(totalProducts?.count || 0),
    totalCategories: Number(totalCategories?.count || 0),
    recentProducts,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Total Products</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Total Categories</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalCategories}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-bold">Recent Products</h2>
        <div className="mt-4 space-y-4">
          {stats.recentProducts.map((product: any) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${product.price}
                </p>
              </div>
              <a
                href={`/admin/products/${product.id}/edit`}
                className="text-sm text-primary hover:underline"
              >
                Edit
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
