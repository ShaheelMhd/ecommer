import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/authOptions";
import { reviewSchema } from "../schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = reviewSchema.safeParse(body);

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

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const reviewed = await prisma.review.findFirst({
    where: { userId: user.id, productId: body.productId },
  });

  if (reviewed)
    return NextResponse.json(
      { error: "User already reviewed!" },
      { status: 400 }
    );

  const review = await prisma.review.create({
    data: {
      userId: user.id,
      productId: body.productId,
      rating: body.rating,
      comment: body.comment,
    },
  });

  return NextResponse.json({ id: review.id }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const validation = z
    .object({ productId: z.string().max(191) })
    .safeParse(body);

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

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const review = await prisma.review.findFirst({
    where: { userId: user.id, productId: body.productId },
  });

  if (!review)
    return NextResponse.json({ error: "No review found!" }, { status: 400 });

  const deleteReview = await prisma.review.delete({
    where: { id: review?.id },
  });

  return NextResponse.json(deleteReview, { status: 200 });
}
