import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    // Use transaction to ensure data consistency
    await db.transaction(async (trx) => {
      // Create product
      const [productId] = await trx("products")
        .insert({
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
        })
        .returning("id");

      // Upload images and create product_images records
      if (images.length > 0) {
        const imageValues = images.map((_, index) => ({
          product_id: productId,
          image_url: `/uploads/${productId}-${index + 1}.jpg`, // Placeholder URL
          is_primary: index === 0,
        }));

        await trx("product_images").insert(imageValues);
      }
    });

    return new NextResponse(null, { status: 201 });
  } catch (error) {
    console.error("[PRODUCT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
