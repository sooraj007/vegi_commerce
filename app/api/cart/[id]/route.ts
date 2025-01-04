import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// PATCH /api/cart/[id] - Update cart item quantity
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure we have the user ID from the session
    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return new NextResponse("User ID not found", { status: 400 });
    }

    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== "number" || quantity < 0) {
      return new NextResponse("Invalid quantity", { status: 400 });
    }

    const db = await getDb();

    // Get the cart item and verify it belongs to the user
    const cartItem = await db
      .select("ci.*")
      .from("cart_items as ci")
      .join("carts as c", "ci.cart_id", "c.id")
      .where({
        "ci.id": params.id,
        "c.user_id": userId,
      })
      .first();

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    if (quantity === 0) {
      // Delete the item if quantity is 0
      await db("cart_items").where("id", params.id).delete();
    } else {
      // Update the quantity
      await db("cart_items").where("id", params.id).update({
        quantity,
        updated_at: new Date(),
      });
    }

    return new NextResponse("Cart item updated", { status: 200 });
  } catch (error) {
    console.error("[CART_ITEM_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure we have the user ID from the session
    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return new NextResponse("User ID not found", { status: 400 });
    }

    const db = await getDb();

    // Verify the cart item belongs to the user before deleting
    const cartItem = await db
      .select("ci.*")
      .from("cart_items as ci")
      .join("carts as c", "ci.cart_id", "c.id")
      .where({
        "ci.id": params.id,
        "c.user_id": userId,
      })
      .first();

    if (!cartItem) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    await db("cart_items").where("id", params.id).delete();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CART_ITEM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
