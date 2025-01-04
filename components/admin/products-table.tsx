"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  old_price: number | null;
  stock_quantity: number;
  category_name: string;
  is_new: boolean;
  is_sale: boolean;
  images: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
  }> | null;
}

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({
  products: initialProducts,
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(initialProducts);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={product.images?.[0]?.image_url || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <span className="font-medium text-[#DEB887]">
                      {formatPrice(product.price)}
                    </span>
                    {product.old_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.old_price)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    {product.is_new && (
                      <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        New
                      </span>
                    )}
                    {product.is_sale && (
                      <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        Sale
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        (window.location.href = `/admin/products/${product.id}/edit`)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
