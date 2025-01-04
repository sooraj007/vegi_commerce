import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
