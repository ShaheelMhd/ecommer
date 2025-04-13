import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "../../schema";
import { prisma } from "@/prisma/client";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const validation = productSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        specs: body.specs,
        brand: body.brand,
        price: body.price,
        stock: body.stock,
      },
    });

    return NextResponse.json(updatedProduct.id, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
