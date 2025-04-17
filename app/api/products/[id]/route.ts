import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!product)
    return NextResponse.json({ error: "Product not found!" }, { status: 400 });

  return NextResponse.json(product, { status: 200 });
}
