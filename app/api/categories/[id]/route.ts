import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, slug } = body;

    if (!name || !slug) {
      return new NextResponse("Name and slug are required", { status: 400 });
    }

    const db = await getDb();

    // Check if slug is unique (excluding current category)
    const existing = await db
      .select("id")
      .from("categories")
      .where("slug", slug)
      .whereNot("id", id)
      .first();

    if (existing) {
      return new NextResponse("Slug must be unique", { status: 400 });
    }

    const [category] = await db("categories")
      .where({ id })
      .update({
        name,
        description,
        slug,
        updated_at: new Date(),
      })
      .returning("*");

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const db = await getDb();

    // Check if category has products
    const products = await db
      .select("id")
      .from("products")
      .where("category_id", id)
      .first();

    if (products) {
      return new NextResponse(
        "Cannot delete category with associated products",
        { status: 400 }
      );
    }

    await db("categories").where({ id }).delete();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await getDb();
    const category = await db
      .select("*")
      .from("categories")
      .where("id", id)
      .first();

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
