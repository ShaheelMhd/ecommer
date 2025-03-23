import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AddToCartButton from "@/components/AddToCartButton";
import DeleteReviewButton from "@/components/DeleteReviewButton";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import TextClamp from "@/components/TextClamp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserReview from "@/components/UserReview";
import ViewCartButton from "@/components/ViewCartButton";
import { prisma } from "@/prisma/client";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

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
    include: { images: { where: { productId: id } }, category: true },
  });

  if (!product) return notFound();

  const reviews = await prisma.review.findMany({
    where: { productId: product.id },
    include: { user: { select: { name: true } } },
  });

  const totalRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;

  // dynamically set this based on if user has bought this product before
  const boughtBefore = true;
  const reviewed =
    reviews.filter((review) => review.userId === user!.id).length > 0
      ? true
      : false;

  // shows products in the same category as suggested
  const suggested = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
  });

  return (
    <>
      <nav className="flex gap-1 items-center">
        <Link
          href="/"
          className="transition duration-200 opacity-80 hover:opacity-100"
        >
          Home
        </Link>{" "}
        <FaChevronRight className="scale-[65%]" />
        <Link
          href={`/${product.brand}`}
          className="transition duration-200 opacity-80 hover:opacity-100"
        >
          {product.brand}
        </Link>
        <FaChevronRight className="scale-[65%]" />
        <Link
          href={`/categories/${product.categoryId}?brand=${product.brand}`}
          className="transition duration-200 capitalize opacity-80 hover:opacity-100"
        >
          {product.category.name}
        </Link>
      </nav>
      <section className="mb-[5rem] grid grid-cols-[3fr_4fr] gap-8 mt-7 min-h-[25rem]">
        <Image
          src={product.images[0]?.path}
          alt={product.images[0]?.alt}
          width={400}
          height={400}
          className="justify-self-center my-auto"
        />
        <div className="col-start-2 pr-10 flex flex-col justify-between">
          <div>
            <Link
              href={`/brands/${product.brand}`}
              className="opacity-80 hover:opacity-100 transition duration-200"
            >
              View {product.brand} Products
            </Link>
            <h2 className="line-clamp-2">{product.name}</h2>
            <span className="mt-1 flex gap-3 items-center">
              <h3 className="text-stone-400">
                ${product.price.toLocaleString()}
              </h3>
              <Separator orientation="vertical" className="h-4" />
              {reviews.length > 0 ? (
                <>
                  <StarRating rating={totalRating} />
                  {reviews.length === 1 ? (
                    <p className="opacity-85">{`${totalRating}/5 from ${reviews.length} rating`}</p>
                  ) : (
                    <p className="opacity-85">{`${totalRating}/5 from ${reviews.length} ratings`}</p>
                  )}
                </>
              ) : (
                <h3 className="text-stone-400">No ratings yet!</h3>
              )}
            </span>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            {(await prisma.cart.findFirst({
              where: { productId: id, userId: user?.id },
            })) ? (
              <ViewCartButton />
            ) : (
              <AddToCartButton className="w-[50%]" productId={id} />
            )}
            <Button className="w-[50%]" variant="default">
              Buy Now
            </Button>
          </div>
        </div>
      </section>
      <section id="description" className="mb-[3rem]">
        <h1>Description</h1>
        <TextClamp text={product.description} />
      </section>
      {product.specs && (
        <section id="specs" className="mb-[3rem]">
          <h1>Specifications</h1>
          <ul>
            {Object.entries(product.specs!).map(([key, value]) => (
              <span className="grid grid-cols-[1fr_5fr] mb-1.5" key={key}>
                <p className="font-bold uppercase">{key}</p>
                <p>{value}</p>
              </span>
            ))}
          </ul>
        </section>
      )}
      <section id="reviews" className="mb-[3rem]">
        <h1>Reviews</h1>
        {reviews.length === 0 ? (
          <div>
            <h3>No reviews yet!</h3>
            {boughtBefore && (
              <div className="mt-3">
                <UserReview productId={id} />
              </div>
            )}
          </div>
        ) : (
          <>
            {boughtBefore && !reviewed ? (
              <UserReview productId={id} />
            ) : (
              reviews
                .filter((review) => review.userId === user!.id)
                .map((review) => (
                  <div key={review.id}>
                    <span className="flex justify-between">
                      <h2>You</h2>
                      <DeleteReviewButton productId={id} />
                    </span>
                    <span className="flex gap-2 items-center mb-2">
                      <StarRating rating={review.rating} />
                      <p>{`(${review.rating}/5)`}</p>
                    </span>
                    <p className="text-lg mb-1">{review.comment}</p>
                    <p className="opacity-80 text-sm">
                      Added on {review.createdAt.toLocaleDateString()} at{" "}
                      {review.createdAt.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                ))
            )}
            {reviews
              .filter((review) => review.userId !== user!.id)
              .map((review) => (
                <div key={review.id}>
                  {reviews.length > 1 ? (
                    <Separator className="my-5 opacity-65 w-[80%] justify-self-center" />
                  ) : null}
                  <h2>{review.user.name}</h2>
                  <span className="flex gap-2 items-center mb-2">
                    <StarRating rating={review.rating} />
                    <p>{`(${review.rating}/5)`}</p>
                  </span>
                  <p className="text-lg mb-1">{review.comment}</p>
                  <p className="opacity-80 text-sm">
                    Added on {review.createdAt.toLocaleDateString()} at{" "}
                    {review.createdAt.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              ))}
          </>
        )}
      </section>
      <section id="suggested">
        <h1>Suggested for You</h1>
        <div className="overflow-x-auto scrollbar-hidden w-full">
          <div className="flex gap-3.5 w-max">
            {suggested
              .filter((product) => product.id !== id)
              .map((product) => (
                <div className="flex-shrink-0">
                  <ProductCard
                    id={product.id}
                    className="w-[20rem] h-[27rem]"
                  />
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
