import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const schema = z.object({
  productId: z.string().max(191),
  quantity: z.number().max(10).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "User must be logged in!" },
      { status: 401 }
    );

  const user = await prisma.user.findFirst({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: body.productId },
  });

  if (!product) return NextResponse.json("Product not found.");

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 0,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: body.productId,
      quantity: body.quantity ? body.quantity : 1,
      price: product.price,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { totalAmount: { increment: product.price } },
  });

  return NextResponse.json(order.status, { status: 201 });
}
