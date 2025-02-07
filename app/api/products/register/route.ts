import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "../../schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = productSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const category = await prisma.category.findUnique({
    where: {
      name: body.categoryId,
    },
  });

  if (!category)
    return NextResponse.json({ error: "Category not found!" }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      categoryId: category.id,
    },
  });

  return NextResponse.json(product, { status: 200 });
}
