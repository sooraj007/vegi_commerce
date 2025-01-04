import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import CategoryForm from "@/components/admin/category-form";

async function getCategory(id: string) {
  const db = await getDb();
  const category = await db
    .select("*")
    .from("categories")
    .where("id", id)
    .first();

  return category;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Category</h1>
      <CategoryForm initialData={category} />
    </div>
  );
}
