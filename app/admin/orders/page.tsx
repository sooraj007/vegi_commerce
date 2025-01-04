import { getDb } from "@/lib/db";

async function getOrders() {
  const db = await getDb();
  return await db
    .select(
      "o.*",
      db.raw(
        "COALESCE(json_agg(json_build_object('id', oi.id, 'product_name', p.name, 'quantity', oi.quantity, 'price', p.price)) FILTER (WHERE oi.id IS NOT NULL), '[]') as items"
      )
    )
    .from("orders as o")
    .leftJoin("order_items as oi", "o.id", "oi.order_id")
    .leftJoin("products as p", "oi.product_id", "p.id")
    .groupBy("o.id")
    .orderBy("o.created_at", "desc");
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 px-4">#{order.id}</td>
                <td className="py-3 px-4">
                  {order.customer_name || "Anonymous"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "delivered"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status || "Processing"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  ${order.total_amount?.toFixed(2) || "0.00"}
                </td>
                <td className="py-3 px-4">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`/admin/orders/${order.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
