import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Props) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!product)
    return NextResponse.json({ error: "Product not found!" }, { status: 400 });

  return NextResponse.json(product, { status: 200 });
}
