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

interface ProductInfo {
  id: string;
  width?: number;
  height?: number;
}

const LongProductCard = async ({ id, width, height }: ProductInfo) => {
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
    <Card className="dark:bg-neutral-900">
      <div className="flex h-full">
        <CardContent
          className="pt-6 max-sm:p-2 max-sm:mr-1 flex-shrink-0
        my-auto max-sm:size-32"
        >
          <Image
            src={image[0].path}
            alt={image[0].alt}
            width={width ? width : 230}
            height={height ? height : 230}
            className="justify-self-center"
          />
        </CardContent>
        <div className="flex flex-col justify-between">
          <CardHeader className="pl-0 max-sm:pt-4">
            <Link href={`/products/${id}`}>
              <CardTitle
                className="line-clamp-2 dark:text-slate-200 dark:text-opacity-90
              max-sm:text-lg/5"
              >
                {product.name}
              </CardTitle>
            </Link>
            <CardDescription className="line-clamp-2 max-sm:hidden">
              {product.description}
            </CardDescription>
            <h3 className="text-stone-500 dark:text-zinc-400 max-sm:text-sm">
              ${product.price.toLocaleString()}
            </h3>
          </CardHeader>
          <CardFooter className="grid grid-cols-2 gap-3 pl-0 max-sm:pb-4">
            <AddToCartButton productId={product.id} className="max-sm:h-8" />
            <Button variant="default" className="max-sm:h-8">Buy Now</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default LongProductCard;
