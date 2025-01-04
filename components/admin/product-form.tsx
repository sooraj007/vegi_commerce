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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  old_price: z.string().default(""),
  stock_quantity: z.string().min(1, "Stock quantity is required"),
  category_id: z.string().min(1, "Category is required"),
  is_new: z.boolean().default(false),
  is_sale: z.boolean().default(false),
  nutritional_info: z
    .object({
      calories: z.string().default(""),
      protein: z.string().default(""),
      carbs: z.string().default(""),
      fat: z.string().default(""),
    })
    .default({
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    }),
});

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  old_price?: string;
  stock_quantity: string;
  category_id: string;
  is_new: boolean;
  is_sale: boolean;
  nutritional_info?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface ProductFormProps {
  categories: Category[];
  initialData?: Product;
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
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price?.toString() ?? "",
      old_price: initialData?.old_price?.toString() ?? "",
      stock_quantity: initialData?.stock_quantity?.toString() ?? "",
      category_id: initialData?.category_id ?? "",
      is_new: initialData?.is_new ?? false,
      is_sale: initialData?.is_sale ?? false,
      nutritional_info: {
        calories: initialData?.nutritional_info?.calories ?? "",
        protein: initialData?.nutritional_info?.protein ?? "",
        carbs: initialData?.nutritional_info?.carbs ?? "",
        fat: initialData?.nutritional_info?.fat ?? "",
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

      toast.success(
        initialData
          ? "Product updated successfully"
          : "Product created successfully"
      );

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(
        initialData ? "Failed to update product" : "Failed to create product"
      );
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl mx-auto"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Basic Information Card */}
          <Card className="bg-[#1C1C1C] border-[#2C2C2C]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-white">
                Basic Information
              </CardTitle>
              <CardDescription>Enter the product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Product name"
                        className="bg-[#2C2C2C] border-0"
                        {...field}
                      />
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
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#2C2C2C] border-0">
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        className="min-h-[80px] bg-[#2C2C2C] border-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing and Stock Card */}
          <Card className="bg-[#1C1C1C] border-[#2C2C2C]">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-white">
                Pricing & Stock
              </CardTitle>
              <CardDescription>Manage pricing and inventory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-[#2C2C2C] border-0"
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
                      <FormLabel className="text-white">Old Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="bg-[#2C2C2C] border-0"
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
                    <FormLabel className="text-white">Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        className="bg-[#2C2C2C] border-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="is_new"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg bg-[#2C2C2C] p-3">
                      <FormLabel className="text-white font-normal">
                        Mark as New
                      </FormLabel>
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
                    <FormItem className="flex items-center justify-between rounded-lg bg-[#2C2C2C] p-3">
                      <FormLabel className="text-white font-normal">
                        Mark as Sale
                      </FormLabel>
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
            </CardContent>
          </Card>
        </div>

        {/* Images Card */}
        <Card className="bg-[#1C1C1C] border-[#2C2C2C]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white">Product Images</CardTitle>
            <CardDescription>Upload product images</CardDescription>
          </CardHeader>
          <CardContent>
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
              <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg bg-[#2C2C2C] border-2 border-dashed border-[#3C3C3C] hover:border-[#4C4C4C] transition-colors">
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
          </CardContent>
        </Card>

        {/* Nutritional Information Card */}
        <Card className="bg-[#1C1C1C] border-[#2C2C2C]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white">
              Nutritional Information
            </CardTitle>
            <CardDescription>Add nutritional details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              <FormField
                control={form.control}
                name="nutritional_info.calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Calories</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        className="bg-[#2C2C2C] border-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutritional_info.protein"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Protein (g)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        className="bg-[#2C2C2C] border-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutritional_info.carbs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Carbs (g)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        className="bg-[#2C2C2C] border-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutritional_info.fat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Fat (g)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        className="bg-[#2C2C2C] border-0"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className=" text-[#353535] hover:bg-[#DEB887]/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
