import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddToCartButton from "@/components/AddToCartButton";
import GoToCartButton from "@/components/GoToCartButton";
import TextClamp from "@/components/TextClamp";
import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
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
    <>
      <section className="mb-[5rem] grid grid-cols-[3fr_4fr] gap-8 mt-5 min-h-[25rem]">
        <Image
          src={product.images[0]?.path}
          alt={product.images[0]?.alt}
          width={400}
          height={400}
          className="justify-self-center my-auto"
        />
        <div className="col-start-2 pr-10 flex flex-col justify-between">
          <div>
            <h2 className="line-clamp-2">{product.name}</h2>
            <h3 className="text-stone-400 mt-1">
              ${product.price.toLocaleString()}
            </h3>
          </div>
          <div className="mt-6 flex justify-center gap-3">
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
      {/* add product rating below the product name
          add review section separate the component
          review addable if product is bought by the user */}
      <section id="description" className="mb-[3rem]">
        <h1>Description</h1>
        <TextClamp text={product.description} />
      </section>
      {product.specs ? (
        <section id="specs" className="mb-[3rem]">
          <h1>Specifications</h1>
          <ul>
            {Object.entries(product.specs!).map(([key, value]) => (
              <span className="grid grid-cols-[1fr_5fr] mb-1.5">
                <p className="font-bold uppercase">{key}</p>
                <li key={key}>{value}</li>
              </span>
            ))}
          </ul>
        </section>
      ) : null}
      <section id="reviews">
        <h1>Reviews</h1>
      </section>
    </>
  );
};

export default ProductPage;
