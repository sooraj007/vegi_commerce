import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET /api/cart - Get user's cart items
export async function GET() {
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

    // Get or create cart for the user
    let cart = await db("carts").where({ user_id: userId }).first();

    if (!cart) {
      [cart] = await db("carts").insert({ user_id: userId }).returning("*");
    }

    // Get cart items with product details
    const cartItems = await db
      .select(
        "ci.id",
        "ci.quantity",
        "p.id as product_id",
        "p.name",
        db.raw("CAST(p.price AS FLOAT) as price"),
        db.raw("CAST(p.old_price AS FLOAT) as old_price"),
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
      .from("cart_items as ci")
      .join("products as p", "ci.product_id", "p.id")
      .leftJoin("categories as c", "p.category_id", "c.id")
      .where("ci.cart_id", cart.id);

    // Transform the data to ensure numbers are correct
    const transformedCartItems = cartItems.map((item) => ({
      ...item,
      price: Number(item.price),
      old_price: item.old_price ? Number(item.old_price) : null,
      quantity: Number(item.quantity),
    }));

    return NextResponse.json(transformedCartItems);
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const db = await getDb();

    // Get or create cart for the user
    let cart = await db("carts").where({ user_id: userId }).first();

    if (!cart) {
      [cart] = await db("carts").insert({ user_id: userId }).returning("*");
    }

    // Check if item already exists in cart
    const existingItem = await db("cart_items")
      .where({
        cart_id: cart.id,
        product_id: productId,
      })
      .first();

    if (existingItem) {
      // Update quantity if item exists
      await db("cart_items")
        .where("id", existingItem.id)
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date(),
        });
    } else {
      // Add new item if it doesn't exist
      await db("cart_items").insert({
        cart_id: cart.id,
        product_id: productId,
        quantity,
      });
    }

    return new NextResponse("Item added to cart", { status: 200 });
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
