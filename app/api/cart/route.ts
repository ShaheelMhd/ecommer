import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions";
import { cartSchema } from "../schema";

export async function GET() {
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

  const cart = await prisma.cart.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { images: { where: { isPrimary: true } } } },
    },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(cart, { status: 201 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = cartSchema.safeParse(body);

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "User must be logged in!" },
      { status: 401 }
    );

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { email: session.user?.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const cart = await prisma.cart.upsert({
    where: {
      productId_userId: {
        productId: body.productId,
        userId: user.id,
      },
    },
    update: {
      quantity: { increment: 1 },
    },
    create: {
      productId: body.productId,
      userId: user.id,
      quantity: 1, // Initial quantity
    },
  });

  return NextResponse.json({ id: cart.id }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "User must be logged in!" },
      { status: 401 }
    );

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const cart = await prisma.cart.delete({
    where: {
      productId_userId: {
        productId: body.productId,
        userId: user.id,
      },
    },
  });

  return NextResponse.json(cart, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  try {
    const updatedCart = await prisma.cart.updateMany({
      where: { userId: body.userId, productId: body.productId },
      data: { quantity: body.quantity },
    });

    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
