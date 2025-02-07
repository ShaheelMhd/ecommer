import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/route";
import QuantitySelector from "../components/QuantitySelector";
import RemoveFromCartButton from "../components/RemoveFromCartButton";

interface ProductInfo {
  width?: number;
  height?: number;
  link?: string;
}

const CartPage = async ({
  width,
  height,
  link,
}: ProductInfo) => {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: "User must be logged in!" },
      { status: 401 }
    );

  const user = await prisma.user.findFirst({
    where: { email: session.user?.email! },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 400 });
  }

  const cartProducts = await prisma.cart.findMany({
    where: { userId: user.id },
    include: {
      product: { include: { images: { where: { isPrimary: true } } } },
    },
  });

  return (
    <>
      <h1>Your Cart</h1>
      <div className="grid grid-cols-[2fr_1fr] min-h-full gap-5">
        {cartProducts.map((cartProduct) => {
          const product = cartProduct.product;
          const productImage = cartProduct.product.images[0];

          return (
            <Card className="col-start-1">
              <div className="flex h-full w-full">
                <CardContent className="pt-6 flex-shrink-0 my-auto aspect-square flex items-center justify-center">
                  <Image
                    src={productImage.path}
                    alt={productImage.alt}
                    width={width ? width : 230}
                    height={height ? height : 230}
                    className="my-auto"
                  />
                </CardContent>
                <div className="flex flex-col justify-between w-full">
                  <CardHeader className="pl-0">
                    <Link href={link ? link : "#"}>
                      <CardTitle>
                        {product.name.length > 60
                          ? product.name.substring(0, 60) + "..."
                          : product.name}
                      </CardTitle>
                    </Link>
                    <h2>${product.price.toLocaleString()}</h2>
                  </CardHeader>
                  <CardFooter className="grid grid-cols-2 gap-3 pl-0">
                    <QuantitySelector
                      cartProduct={cartProduct}
                      userId={user.id}
                    />
                    <RemoveFromCartButton productId={product.id} />
                  </CardFooter>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default CartPage;
