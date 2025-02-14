import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/route";
import QuantitySelector from "../components/QuantitySelector";
import RemoveFromCartButton from "../components/RemoveFromCartButton";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NumberFlow from "@number-flow/react";

interface ProductInfo {
  width?: number;
  height?: number;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Cart - Ecommer",
    description: "Manage products in your cart.",
  };
}

const CartPage = async ({ width, height }: ProductInfo) => {
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
    orderBy: { addedAt: "desc" },
  });

  const cartTotal = cartProducts.reduce((sum, cartProduct) => {
    return sum + cartProduct.product.price * cartProduct.quantity;
  }, 0);

  return (
    <>
      {cartProducts.length === 0 ? (
        <div className="full-screen-height flex justify-center align-center">
          <p className="text-2xl my-auto">Your cart is empty!</p>
        </div>
      ) : (
        <>
          <h1>Your Cart</h1>
          <div className="grid grid-cols-[2fr_1fr] min-h-full gap-5">
            <section>
              {cartProducts.map((cartProduct) => {
                const product = cartProduct.product;
                const productImage = cartProduct.product.images[0];
                return (
                  <Card className="col-start-1 mb-5">
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
                          <Link href={`/products/${cartProduct.productId}`}>
                            <CardTitle>
                              {product.name.length > 60
                                ? product.name.substring(0, 60) + "..."
                                : product.name}
                            </CardTitle>
                          </Link>
                          <h3>${product.price.toLocaleString()}</h3>
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
            </section>
            <section>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Cart Summary</CardTitle>
                  <CardDescription>
                    Info on your cart at a glance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-shrink-0 my-auto">
                  <div>
                    {cartProducts.map((cartProduct) => {
                      const product = cartProduct.product;

                      return (
                        <div className="flex justify-between gap-3 mb-3">
                          <p className="w-[70%] line-clamp-2">{product.name}</p>
                          <p className="text-stone-500">
                            ${product.price.toLocaleString()} *{" "}
                            {cartProduct.quantity}
                          </p>
                        </div>
                      );
                    })}
                    <Separator className="w-[85%] justify-self-center" />
                    <div className="mt-3 flex justify-between font-semibold">
                      <p>Total</p>
                      <p>${cartTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="align-bottom">
                  <Button variant="default" className="w-full">
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default CartPage;
