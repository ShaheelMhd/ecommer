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
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <Link href={`/products/${id}`}>
          <CardTitle className="line-clamp-2">{product.name}</CardTitle>
        </Link>
        <h3 className="text-stone-500">${product.price.toLocaleString()}</h3>
      </CardHeader>
      <CardContent className="flex-shrink-0 my-auto">
        <Image
          src={image[0].path}
          alt={image[0].alt}
          width={width ? width : 210}
          height={height ? height : 210}
          className="justify-self-center"
        />
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3 align-bottom">
        <AddToCartButton productId={product.id} />
        <Button variant="default">Buy now</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
