import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/prisma/client";
import Image from "next/image";
import Link from "next/link";

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
        <CardContent
          className="pt-6 max-sm:p-2 max-sm:mr-1 flex-shrink-0
        my-auto max-sm:size-32 max-sm:flex"
        >
          <Image
            src={image[0].path}
            alt={image[0].alt}
            width={width ? width : 230}
            height={height ? height : 230}
            className="justify-self-center max-sm:items-center
            max-sm:h-fit max-sm:my-auto"
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
            <h3 className="text-stone-500 dark:text-zinc-400">
              ${product.price.toLocaleString()}
            </h3>
          </CardHeader>
        </div>
      </div>
    </Card>
  );
};

export default OrderItemCard;
