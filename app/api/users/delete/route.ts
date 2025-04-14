import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json("ID not provided in the URL.", { status: 400 });

  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json(deletedUser.name, { status: 200 });
}
