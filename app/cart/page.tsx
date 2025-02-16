"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import QuantitySelector from "../components/QuantitySelector";
import Link from "next/link";
import Image from "next/image";
import RemoveFromCartButton from "../components/RemoveFromCartButton";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react";

interface ProductImage {
  productId: string;
  path: string;
  id: string;
  alt: string;
  createdAt: Date;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  images: ProductImage[];
}

interface Cart {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: Date;
  product: Product;
}

const CartPage = () => {
  const [cart, setCart] = useState<Cart[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });

      if (!response.ok) throw new Error("Failed to fetch cart!");

      const cartData: Cart[] = await response.json();
      setCart(cartData);
    } catch (error) {
      console.log("Error fetching cart: ", error);
      toast.error("Error fetching the cart!");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );

    setCartTotal(total);
  }, [cart]);

  return (
    <>
      {cart.length === 0 ? (
        <div className="full-screen-height flex justify-center align-center">
          <p className="text-2xl my-auto">Your cart is empty!</p>
        </div>
      ) : (
        <>
          <h1>Your Cart</h1>
          <div className="grid grid-cols-[2fr_1fr] min-h-full gap-5">
            <section>
              {cart.map((cartProduct) => {
                const product = cartProduct.product;
                const productImage = cartProduct.product.images[0];

                return (
                  <Card key={cartProduct.id} className="col-start-1 mb-5">
                    <div className="flex h-full w-full">
                      <CardContent
                        className="pt-6 flex-shrink-0 my-auto aspect-square 
                      flex items-center justify-center"
                      >
                        <Image
                          src={productImage.path}
                          alt={productImage.alt}
                          width={230}
                          height={230}
                          className="my-auto"
                        />
                      </CardContent>
                      <div className="flex flex-col justify-between w-full">
                        <CardHeader className="pl-0">
                          <Link href={`/products/${product.id}`}>
                            <CardTitle className="line-clamp-2">
                              {product.name}
                            </CardTitle>
                          </Link>
                          <h3>${product.price.toLocaleString()}</h3>
                        </CardHeader>
                        <CardFooter className="grid grid-cols-2 gap-3 pl-0">
                          <QuantitySelector
                            fetchCart={fetchCart}
                            cartProduct={cartProduct}
                            userId={cart[0].userId}
                          />
                          <RemoveFromCartButton
                            removeFromCart={removeFromCart}
                            productId={product.id}
                          />
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </section>
            <section>
              <Card className="flex flex-col max-h-[var(--full-screen-height)] overflow-scroll">
                <CardHeader>
                  <CardTitle>Cart Summary</CardTitle>
                  <CardDescription>Your cart at a glance.</CardDescription>
                </CardHeader>
                <CardContent className="flex-shrink-0 mb-auto">
                  <div>
                    {cart.map((cartProduct) => {
                      const product = cartProduct.product;

                      return (
                        <div className="flex justify-between gap-3 mb-2.5">
                          <p className="w-[70%] line-clamp-2">{product.name}</p>
                          <p className="text-stone-500">
                            ${product.price.toLocaleString()} *{" "}
                            {cartProduct.quantity}
                          </p>
                        </div>
                      );
                    })}
                    <Separator className="w-[85%] justify-self-center" />
                    <div className="mt-2 flex justify-between font-semibold">
                      <p>Total</p>
                      <NumberFlow
                        value={cartTotal}
                        format={{
                          notation: "standard",
                          style: "currency",
                          currency: "USD",
                        }}
                        spinTiming={{
                          duration: 1250,
                          easing: "cubic-bezier(0, 0, 0.2, 1)",
                        }}
                      />
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
