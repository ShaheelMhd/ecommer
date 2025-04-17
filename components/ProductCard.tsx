import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  // useful for explicitly setting height of the card
  className?: string;
}

const ProductCard = async ({ id, width, height, className }: Props) => {
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
    <Card className={`flex flex-col ${className} dark:bg-neutral-900`}>
      <CardHeader className="max-sm:p-4 max-sm:pb-3">
        <Link href={`/products/${id}`}>
          <CardTitle
            className="line-clamp-2 dark:text-slate-200 dark:text-opacity-90
          sm:text-lg/5 md:text-2xl/7"
          >
            {product.name}
          </CardTitle>
        </Link>
        <h3 className="text-stone-500 dark:text-zinc-400 max-sm:text-[1rem]">
          ${product.price.toLocaleString()}
        </h3>
      </CardHeader>
      <CardContent
        className="flex-shrink-0 my-auto max-sm:flex max-sm:justify-center
      max-sm:p-3 max-sm:pt-0"
      >
        <Image
          src={image[0].path}
          alt={image[0].alt}
          width={width ? width : 210}
          height={height ? height : 210}
          className="justify-self-center"
        />
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3 align-bottom max-sm:hidden">
        <AddToCartButton productId={product.id} className="max-sm:h-8" />
        <Button variant="default" className="max-sm:h-8">
          Buy now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
