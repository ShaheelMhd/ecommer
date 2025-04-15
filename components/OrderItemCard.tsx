import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/prisma/client";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface Props {
  id: string;
  width?: number;
  height?: number;
  className?: string;
}

const OrderItemCard = async ({ id, width, height, className }: Props) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!product) return null;

  const image = await prisma.productImage.findMany({
    where: {
      productId: product.id,
      isPrimary: true,
    },
  });

  if (image.length === 0) return null;

  return (
    <Card className={`dark:bg-neutral-900 ${className}`}>
      <div className="flex h-full">
        <CardContent className="pt-6 flex-shrink-0 my-auto">
          <Image
            src={image[0].path}
            alt={image[0].alt}
            width={width ? width : 230}
            height={height ? height : 230}
            className="justify-self-center"
          />
        </CardContent>
        <div className="flex flex-col justify-between">
          <CardHeader className="pl-0">
            <Link href={`/products/${id}`}>
              <CardTitle className="line-clamp-2 dark:text-slate-200 dark:text-opacity-90">
                {product.name}
              </CardTitle>
            </Link>
            <CardDescription className="line-clamp-2">
              {product.description}
            </CardDescription>
            <h3 className="text-stone-500 dark:text-zinc-400">
              ${product.price.toLocaleString()}
            </h3>
          </CardHeader>
          {/* <CardFooter className="grid grid-cols-2 gap-3 pl-0">
            <AddToCartButton productId={product.id} />
            <Button variant="default">Buy Now</Button>
          </CardFooter> */}
        </div>
      </div>
    </Card>
  );
};

export default OrderItemCard;
