import { NextRequest, NextResponse } from "next/server";
import { imageSchema } from "../schema";
import { prisma } from "@/prisma/client";

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
        isPrimary: (primaryImage ? false : true),
        productId: body.productId,
        },
    });

  return NextResponse.json(image, { status: 200 });
}
