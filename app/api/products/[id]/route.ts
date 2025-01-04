import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = await getDb();
    await db("products").where("id", params.id).delete();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = await getDb();
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const oldPrice = formData.get("old_price")
      ? parseFloat(formData.get("old_price") as string)
      : null;
    const stockQuantity = parseInt(formData.get("stock_quantity") as string);
    const categoryId = formData.get("category_id") as string;
    const isNew = formData.get("is_new") === "true";
    const isSale = formData.get("is_sale") === "true";
    const nutritionalInfo = formData.get("nutritional_info")
      ? JSON.parse(formData.get("nutritional_info") as string)
      : null;
    const images = formData.getAll("images") as File[];

    // Update product using transaction to ensure data consistency
    await db.transaction(async (trx) => {
      // Update product
      await trx("products")
        .where("id", params.id)
        .update({
          name,
          description,
          price,
          old_price: oldPrice,
          stock_quantity: stockQuantity,
          category_id: categoryId,
          is_new: isNew,
          is_sale: isSale,
          nutritional_info: nutritionalInfo
            ? JSON.stringify(nutritionalInfo)
            : null,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          updated_at: trx.fn.now(),
        });

      // Handle images
      if (images.length > 0) {
        // Delete existing images
        await trx("product_images").where("product_id", params.id).delete();

        // Add new images
        const imageValues = images.map((_, index) => ({
          product_id: params.id,
          image_url: `/uploads/${params.id}-${index + 1}.jpg`, // Placeholder URL
          is_primary: index === 0,
        }));

        await trx("product_images").insert(imageValues);
      }
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const product = await db
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
      .where("p.id", params.id)
      .first();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
