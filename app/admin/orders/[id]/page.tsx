import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import UpdateOrderStatus from "@/components/admin/update-order-status";

async function getOrder(id: string) {
  const db = await getDb();
  const order = await db
    .select(
      "o.*",
      db.raw(
        "COALESCE(json_agg(json_build_object('id', oi.id, 'product_name', p.name, 'quantity', oi.quantity, 'price', p.price, 'product_id', p.id)) FILTER (WHERE oi.id IS NOT NULL), '[]') as items"
      )
    )
    .from("orders as o")
    .leftJoin("order_items as oi", "o.id", "oi.order_id")
    .leftJoin("products as p", "oi.product_id", "p.id")
    .where("o.id", id)
    .groupBy("o.id")
    .first();

  return order;
}

interface PageProps {
  params: { id: string };
}

function formatAddress(address: any) {
  if (!address) return "No address provided";

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
}

export default async function OrderDetailsPage({ params }: PageProps) {
  // Ensure params.id is a string
  const { id } = params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  // The items are already an array from the database query
  const items = order.items || [];
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        </div>
        <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Customer Information</h2>
            <div className="mt-2 text-sm">
              <p>Name: {order.customer_name || "Anonymous"}</p>
              <p>Email: {order.customer_email || "N/A"}</p>
              <p>Phone: {order.customer_phone || "N/A"}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Shipping Address</h2>
            <div className="mt-2 text-sm">
              <p>{formatAddress(order.shipping_address)}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Order Status</h2>
            <div className="mt-2">
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
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Order Items</h2>
          <div className="mt-4 space-y-4">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <Link
                    href={`/admin/products/${item.product_id}/edit`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <p className="font-medium">Subtotal</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              {order.shipping_fee && (
                <div className="flex justify-between mt-2">
                  <p className="text-muted-foreground">Shipping</p>
                  <p>${order.shipping_fee.toFixed(2)}</p>
                </div>
              )}
              {order.tax && (
                <div className="flex justify-between mt-2">
                  <p className="text-muted-foreground">Tax</p>
                  <p>${order.tax.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between mt-4 border-t pt-4">
                <p className="text-lg font-bold">Total</p>
                <p className="text-lg font-bold">
                  ${order.total_amount?.toFixed(2) || subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
