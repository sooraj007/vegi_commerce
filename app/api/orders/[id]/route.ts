import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    const db = await getDb();
    await db("orders").where({ id: params.id }).update({
      status,
      updated_at: new Date(),
    });

    return new NextResponse("Order updated successfully", { status: 200 });
  } catch (error) {
    console.error("[ORDER_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
      .where("o.id", params.id)
      .groupBy("o.id")
      .first();

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
