import { supabase } from "@/lib/supabaseClient";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { imageSchema } from "../schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required." },
      { status: 400 }
    );
  }

  try {
    const images = await prisma.productImage.findMany({
      where: { productId: productId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = imageSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  // fetching images that already exist for the same product
  const existingImages = await prisma.productImage.findMany({
    where: {
      productId: body.productId,
    },
  });

  // check if primary image already exists
  const primaryImage = existingImages.find((img) => img.isPrimary);

  // if primary exists, set current image as non-primary
  const image = await prisma.productImage.create({
    data: {
      path: body.path,
      alt: body.alt,
      isPrimary: !existingImages ? true : primaryImage ? false : true,
      productId: body.productId,
    },
  });

  return NextResponse.json(image, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("id");

  if (!imageId) {
    return NextResponse.json(
      { message: "Image ID is required" },
      { status: 400 }
    );
  }

  try {
    const productInfo = await prisma.productImage.findUnique({
      where: { id: imageId },
      select: { productId: true, path: true },
    });

    const supabaseImagePath = `${productInfo?.productId}/${
      productInfo?.path.split("/").slice(-1)[0]
    }`;
    await supabase.storage.from("product-images").remove([supabaseImagePath]);

    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json(deletedImage, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    );
  }
}
