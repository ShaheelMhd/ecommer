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
  className?: string;
  link?: string;
}

const LongProductCard = async ({
  id,
  width,
  height,
  className,
  link,
}: ProductInfo) => {
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
    <Card className="">
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
            <Link href={link ? link : "#"}>
              <CardTitle>
                {product.name.length > 50
                  ? product.name.substring(0, 50) + "..."
                  : product.name}
              </CardTitle>
            </Link>
            <CardDescription>
              {product.description.length > 95
                ? product.description.substring(0, 95) + "..."
                : product.description}
            </CardDescription>
            <h2>${product.price.toLocaleString()}</h2>
          </CardHeader>
          <CardFooter className="grid grid-cols-2 gap-3 pl-0">
            <AddToCartButton productId={product.id} />
            <Button variant="default">Buy Now</Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default LongProductCard;
