import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-bold">New Category</h1>
        </div>
      </div>

      <CategoryForm
        initialData={{
          name: "",
          description: "",
          slug: "",
        }}
      />
    </div>
  );
}
