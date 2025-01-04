"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  old_price: z.string().optional(),
  stock_quantity: z.string().min(1, "Stock quantity is required"),
  category_id: z.string().min(1, "Category is required"),
  is_new: z.boolean().default(false),
  is_sale: z.boolean().default(false),
  nutritional_info: z
    .object({
      calories: z.string(),
      protein: z.string(),
      carbs: z.string(),
      fat: z.string(),
    })
    .optional(),
});

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
}

export default function ProductForm({
  categories,
  initialData,
}: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: "",
      old_price: "",
      stock_quantity: "",
      category_id: "",
      is_new: false,
      is_sale: false,
      nutritional_info: {
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append product data
      Object.entries(values).forEach(([key, value]) => {
        if (key === "nutritional_info") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `/api/products${initialData ? `/${initialData.id}` : ""}`,
        {
          method: initialData ? "PATCH" : "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="old_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Price (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="is_new"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Mark as New</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_sale"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Mark as Sale</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Product Images</FormLabel>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
                <span className="mt-2 block text-sm text-muted-foreground">
                  Add Images
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Nutritional Information</FormLabel>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <FormField
              control={form.control}
              name="nutritional_info.calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutritional_info.protein"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein (g)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutritional_info.carbs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbs (g)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutritional_info.fat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat (g)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#DEB887] text-[#353535] hover:bg-[#DEB887]/90"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
