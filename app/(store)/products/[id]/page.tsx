import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddToCartButton from "@/components/AddToCartButton";
import GoToCartButton from "@/components/GoToCartButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (product) {
    return {
      title: "Buy " + product.name + " - Ecommer",
      description: product.description,
    };
  }

  return {
    title: "Product not found",
    description: "The product you are looking for does not exist.",
  };
}

const ProductPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: { email: session?.user!.email },
  });

  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: { images: { where: { productId: id } } },
  });

  if (!product) return notFound();

  return (
    <section className="grid grid-cols-[3fr_4fr] gap-8 mt-5">
      <Image
        src={product.images[0]?.path}
        alt={product.images[0]?.alt}
        width={400}
        height={400}
        className="justify-self-center my-auto"
      />
      <div className="col-start-2 pr-10 flex flex-col justify-between">
        <div>
          <h2>{product.name}</h2>
          <h3 className="text-stone-400 mt-1">
            ${product.price.toLocaleString()}
          </h3>
          <p className="mt-5 line-clamp-5">{product.description}</p>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          {/* also add user id to 'where' clause */}
          {(await prisma.cart.findFirst({
            where: { productId: id, userId: user?.id },
          })) ? (
            <GoToCartButton />
          ) : (
            <AddToCartButton className="w-[50%]" productId={id} />
          )}
          <Button className="w-[50%]" variant="default">
            Buy Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
