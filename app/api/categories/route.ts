import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
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

    // Check if slug is unique
    const existing = await db
      .select("id")
      .from("categories")
      .where("slug", slug)
      .first();

    if (existing) {
      return new NextResponse("Slug must be unique", { status: 400 });
    }

    const [category] = await db("categories")
      .insert({
        name,
        description,
        slug,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const categories = await db
      .select("*")
      .from("categories")
      .orderBy("name", "asc");

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
