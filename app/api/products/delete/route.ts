import { supabase } from "@/lib/supabaseClient";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    // Delete image folder from supabase
    const { data, error: listError } = await supabase.storage
      .from("product-images")
      .list(id!, { limit: 25 });

    if (listError) throw new Error(`Error listing files: ${listError.message}`);

    if (data?.length === 0) {
      throw new Error("No files found in the folder.");
    }

    const filePaths = data.map((file) => `${id}/${file.name}`);
    const { error: removeError } = await supabase.storage
      .from("product-images")
      .remove(filePaths);

    if (removeError)
      throw new Error(`Error removing files: ${removeError.message}`);

    // Delete product images from the database
    const deleteProductImages = await prisma.productImage.deleteMany({
      where: { productId: id! },
    });
    if (deleteProductImages.count === 0)
      throw new Error("No product images found to delete.");

    // Delete the product itself
    const deleteProduct = await prisma.product.delete({ where: { id: id! } });
    if (!deleteProduct) throw new Error("Product not found to delete.");

    return NextResponse.json(
      { message: "Product deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing product: ", error);
    return NextResponse.json(
      { message: "Failed to delete product." },
      { status: 500 }
    );
  }
}
