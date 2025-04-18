"use client";

import CheckoutButton from "@/components/CheckoutButton";
import QuantitySelector from "@/components/QuantitySelector";
import RemoveFromCartButton from "@/components/RemoveFromCartButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import NumberFlow from "@number-flow/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);

  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });

      if (response.status === 401 || response.status === 400)
        return toast.error("Please log in to view your cart!");

      if (!response.ok) throw new Error("Failed to fetch cart!");

      const cartData: Cart[] = await response.json();
      setCart(cartData);
    } catch (error) {
      console.log("Error fetching cart: ", error);
      toast.error("Error fetching the cart!");
    } finally {
      setLoading(false);
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
      {loading ? (
        <>
          <h1>Your Cart</h1>
          <div className="grid lg:grid-cols-[2fr_1fr] max-md:grid-rows-2 min-h-full gap-5">
            <section className="*:mb-5">
              <Skeleton className="p-6 h-[280px] w-full rounded-xl" />
              <Skeleton className="p-6 h-[280px] w-full rounded-xl" />
            </section>
            <section className="max-md:mt-5">
              <Skeleton className="h-[280px] w-full rounded-xl" />
            </section>
          </div>
        </>
      ) : cart.length === 0 ? (
        <div className="full-screen-height flex justify-center align-center">
          <p className="text-2xl my-auto">Your cart is empty!</p>
        </div>
      ) : (
        <>
          <h1>Your Cart</h1>
          <div
            className="grid lg:grid-cols-[2fr_1fr] max-sm:grid-rows-2 min-h-full
          md:gap-5 sm:gap-1"
          >
            <section>
              {cart.map((cartProduct) => {
                const product = cartProduct.product;
                const productImage = cartProduct.product.images[0];

                return (
                  <Card
                    key={cartProduct.id}
                    className="col-start-1 md:mb-5 sm:mb-1 dark:bg-neutral-900"
                  >
                    <div className="flex h-full w-full">
                      <CardContent
                        className="pt-6 flex-shrink-0 my-auto aspect-square flex
                        items-center justify-center max-sm:p-2 max-sm:mr-1 max-sm:size-32"
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
                        <CardHeader className="pl-0 max-sm:pt-4">
                          <Link href={`/products/${product.id}`}>
                            <CardTitle
                              className="line-clamp-2 dark:text-slate-200
                            max-sm:text-lg/5"
                            >
                              {product.name}
                            </CardTitle>
                          </Link>
                          <h3>${product.price.toLocaleString()}</h3>
                        </CardHeader>
                        <CardFooter
                          className="grid lg:grid-cols-2 max-sm:grid-rows-2 md:gap-3 sm:gap-1
                        pl-0 max-sm:pb-4"
                        >
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
            <section className="max-md:max-h-fit">
              <Card
                className="dark:bg-neutral-900 flex flex-col
              max-h-[var(--full-screen-height)] overflow-scroll max-sm:mt-3"
              >
                <CardHeader>
                  <CardTitle className="dark:text-slate-200">
                    Cart Summary
                  </CardTitle>
                  <CardDescription>Your cart at a glance.</CardDescription>
                </CardHeader>
                <CardContent className="flex-shrink-0 mb-auto">
                  <div>
                    {cart.map((cartProduct) => {
                      const product = cartProduct.product;

                      return (
                        <div
                          key={product.id}
                          className="flex justify-between gap-3 mb-2.5"
                        >
                          <p className="w-[70%] line-clamp-2 dark:text-slate-200">
                            {product.name}
                          </p>
                          <p className="text-stone-500 dark:text-zinc-400">
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
                  <CheckoutButton />
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
