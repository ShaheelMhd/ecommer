"use client";

import { imageSchema, productSchema } from "@/app/api/schema";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  product: {
    name: string;
    description: string;
    brand: string;
    specs: Object | null;
    price: number;
    stock: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: string;
    category: {
      name: string;
    };
  } | null;
}

type image = {
  path: string;
  id: string;
  createdAt: Date;
  productId: string;
  alt: string;
  isPrimary: boolean;
};

const ManageProductForm = ({ product }: Props) => {
  const initialSpecs = product?.specs
    ? Object.entries(product.specs).map(([key, value]) => ({ key, value }))
    : [{ key: "", value: "" }];

  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name,
      description: product?.description,
      specsArray: initialSpecs,
      brand: product?.brand,
      price: product?.price,
      stock: product?.stock,
      category: product?.category.name,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: productForm.control,
    name: "specsArray",
  });

  async function onProductSubmit(values: z.infer<typeof productSchema>) {
    try {
      const specsObject: Record<string, string> = {};
      values.specsArray?.forEach(({ key, value }) => {
        if (key.trim()) {
          specsObject[key.trim()] = value.trim();
        }
      });

      const response = await fetch("/api/products/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product?.id,
          name: values.name,
          description: values.description,
          brand: values.brand,
          specs: specsObject,
          price: values.price,
          stock: values.stock,
          category: values.category,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product!");
      console.log(error);
    }
  }

  const [productImages, setProductImages] = useState<image[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const fetchImages = async () => {
    try {
      const response = await fetch(`/api/images?productId=${product?.id}`);
      const data = await response.json();
      setProductImages(data);
    } catch (error) {
      console.error("Failed to fetch images", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [product?.id]);

  const imageForm = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: undefined,
      path: "",
      alt: "",
      isPrimary: false,
      productId: "",
    },
  });

  const handleImageDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images?id=${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      toast.success("Image deleted successfully.");
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  async function onImageSubmit(values: z.infer<typeof imageSchema>) {
    try {
      // Upload the image to Supabase Storage
      const fileExt = image?.name.split(".").pop();
      const fileName = `${image?.name.split(".")[0]}.${fileExt}`;
      const filePath = `${product?.id.toString()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, image!);

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        toast.error(`Upload error: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      // post image details to the db
      const response = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          productId: product?.id,
          path: data.publicUrl,
          alt: values.alt,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("Image added successfully!");
      fetchImages();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* PRODUCT DETAILS FORM */}
      <div>
        <Form {...productForm}>
          <form
            className="flex flex-col gap-3 min-w-[50vw]"
            onSubmit={productForm.handleSubmit(onProductSubmit)}
          >
            <FormField
              control={productForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter the product name"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={productForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter the product description"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel>Specs</FormLabel>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_2fr_auto] gap-3"
              >
                {/* Key Input */}
                <FormField
                  control={productForm.control}
                  name={`specsArray.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the key"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Value Input */}
                <FormField
                  control={productForm.control}
                  name={`specsArray.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter the value"
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Remove button */}
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="h-full"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            {/* Add More Specs Button */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ key: "", value: "" })}
              className="h-12 col-span-3"
            >
              Add Spec
            </Button>
            <FormField
              control={productForm.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter the brand name"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full grid grid-cols-2 gap-3">
              <FormField
                control={productForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter the product price"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productForm.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter the product stock"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={productForm.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter the product category"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-12 mt-2 text-md w-full"
              disabled={productForm.formState.isSubmitting}
            >
              {productForm.formState.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </div>

      {/* EXISTING PRODUCT IMAGES */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Existing Product Images</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Primary</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Alt Text</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productImages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No product images found.</TableCell>
                </TableRow>
              ) : (
                productImages.map((image: any) => (
                  <TableRow key={image.id}>
                    <TableCell>{image.isPrimary ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Image
                        src={image.path}
                        alt={image.alt}
                        height={100}
                        width={100}
                        className="w-20 h-20 object-cover"
                      />
                    </TableCell>
                    <TableCell>{image.alt}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => handleImageDelete(image.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* PRODUCT IMAGE FORM */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Add New Images</h2>
        <Form {...imageForm}>
          <form
            className="flex flex-col gap-3 min-w-[50vw]"
            onSubmit={imageForm.handleSubmit(onImageSubmit)}
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={imageForm.control}
                name="image"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="h-12"
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImage(file);
                            onChange(file);
                          }
                        }}
                        ref={ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={imageForm.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt text</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter the alt text"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="secondary"
                className="h-12 mt-2 text-md w-full"
                disabled={imageForm.formState.isSubmitting}
                onClick={() => {
                  setImage(null);
                  imageForm.reset();
                }}
              >
                Add Another
              </Button>
              <Button
                type="submit"
                className="h-12 mt-2 text-md w-full"
                disabled={imageForm.formState.isSubmitting}
              >
                {imageForm.formState.isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ManageProductForm;
