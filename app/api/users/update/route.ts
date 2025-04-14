import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json("ID not provided in the URL.");

  const body = await request.json();

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: body.name,
      username: body.username,
      role: body.role,
    },
  });

  return NextResponse.json(updatedUser.name, { status: 200 });
}
