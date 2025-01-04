import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");
    const sortBy = searchParams.get("sortBy") || "p.created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const db = await getDb();
    const offset = (page - 1) * limit;

    // Build the base query without order
    const baseQueryWithoutOrder = db
      .from("products as p")
      .leftJoin("categories as c", "p.category_id", "c.id")
      .where("p.price", ">=", minPrice)
      .where("p.price", "<=", maxPrice);

    // Add search condition if search term exists
    if (search) {
      baseQueryWithoutOrder.where((builder) => {
        builder
          .where("p.name", "ilike", `%${search}%`)
          .orWhere("p.description", "ilike", `%${search}%`);
      });
    }

    // Add category filter if category exists
    if (category) {
      baseQueryWithoutOrder.where("c.name", "ilike", category);
    }

    // Get total count for pagination
    const [{ count }] = await baseQueryWithoutOrder
      .clone()
      .count("p.id as count");

    // Get paginated results with full selection and order
    const products = await baseQueryWithoutOrder
      .clone()
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
        `),
        db.raw(`
          COALESCE(
            (SELECT AVG(rating)::numeric(2,1)
            FROM reviews r
            WHERE r.product_id = p.id),
            0
          ) as rating
        `),
        db.raw(`
          (SELECT COUNT(*)
          FROM reviews r
          WHERE r.product_id = p.id) as reviews_count
        `)
      )
      .orderBy(sortBy, sortOrder)
      .limit(limit)
      .offset(offset);

    // Get all categories with counts
    const categories = await db
      .select("c.id", "c.name", db.raw("COUNT(p.id) as count"))
      .from("categories as c")
      .leftJoin("products as p", "c.id", "p.category_id")
      .groupBy("c.id", "c.name")
      .orderBy("c.name", "asc");

    // Get price range
    const [{ min_price, max_price }] = await db("products")
      .min("price as min_price")
      .max("price as max_price");

    // Transform products to include default rating values
    const transformedProducts = products.map((product) => ({
      ...product,
      is_new:
        product.created_at &&
        new Date(product.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // New if created within last 7 days
    }));

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        total: parseInt(count),
        pages: Math.ceil(parseInt(count) / limit),
        currentPage: page,
        limit,
      },
      filters: {
        categories,
        priceRange: {
          min: min_price || 0,
          max: max_price || 1000,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return NextResponse.json(
      { error: "Failed to fetch shop data" },
      { status: 500 }
    );
  }
}
