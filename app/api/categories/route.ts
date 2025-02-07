import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "../schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = categorySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description,
    },
  });

  return NextResponse.json(category, { status: 200 });
}
