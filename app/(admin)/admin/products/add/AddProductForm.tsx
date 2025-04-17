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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddProductForm = () => {
  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      specsArray: [{ key: "", value: "" }],
      brand: "",
      price: 0,
      stock: 1,
      category: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: productForm.control,
    name: "specsArray", // This binds to the field array in the form
  });

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

  async function onProductSubmit(values: z.infer<typeof productSchema>) {
    try {
      const specsObject: Record<string, string> = {};
      values.specsArray?.forEach(({ key, value }) => {
        if (key.trim()) {
          specsObject[key.trim()] = value.trim();
        }
      });

      const response = await fetch("/api/products/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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

      setProductId(await response.json());
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Failed to add product!");
      console.error(error);
    }
  }

  const [productId, setProductId] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function onImageSubmit(values: z.infer<typeof imageSchema>) {
    try {
      // Upload the image to Supabase Storage
      const fileExt = image?.name.split(".").pop();
      const fileName = `${image?.name.split(".")[0]}.${fileExt}`;
      const filePath = `${productId.toString()}/${fileName}`;

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
          productId: productId,
          path: data.publicUrl,
          alt: values.alt,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("Image added successfully!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* PRODUCT DETAILS FORM */}
      {!productForm.formState.isSubmitted && (
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
                {productForm.formState.isSubmitting
                  ? "Submitting..."
                  : "Continue"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* PRODUCT IMAGE FORM */}
      {productForm.formState.isSubmitSuccessful && (
        <div>
          <Form {...imageForm}>
            <form
              className="flex flex-col gap-3 min-w-[50vw]"
              onSubmit={imageForm.handleSubmit(onImageSubmit)}
            >
              <p className="text-red-500">
                Add the hero image before adding other images
              </p>
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
                  {imageForm.formState.isSubmitting
                    ? "Submitting..."
                    : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default AddProductForm;
