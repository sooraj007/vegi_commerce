import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card px-4 py-6">
        <h2 className="mb-6 text-xl font-bold">Admin Dashboard</h2>
        <nav className="space-y-2">
          <a
            href="/admin/products"
            className="block rounded-lg px-4 py-2 hover:bg-accent"
          >
            Products
          </a>
          <a
            href="/admin/categories"
            className="block rounded-lg px-4 py-2 hover:bg-accent"
          >
            Categories
          </a>
          <a
            href="/admin/orders"
            className="block rounded-lg px-4 py-2 hover:bg-accent"
          >
            Orders
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
