import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions";

export async function POST() {
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
    orderBy: { addedAt: "desc" },
    include: { product: true },
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 0, // to be updated later
    },
  });

  {
    cart.map(async (item) => {
      // add item to orderItem table
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });

      // increment the item's price to totalAmount
      await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount: { increment: item.product.price } },
      });

      // decrement item quantity from the product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });

      // remove item from user's cart
      await prisma.cart.delete({
        where: { id: item.id },
      });
    });
  }

  return NextResponse.json(order, { status: 201 });
}
