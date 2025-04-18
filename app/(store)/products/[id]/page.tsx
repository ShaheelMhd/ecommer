import { authOptions } from "@/app/api/auth/authOptions";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import DeleteReviewButton from "@/components/DeleteReviewButton";
import ImageCarousel from "@/components/ImageCarousel";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import TextClamp from "@/components/TextClamp";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    include: {
      images: { where: { productId: id }, orderBy: { isPrimary: "desc" } },
      category: true,
    },
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
      {/* NAVBAR (PATH) */}
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
          href={`/categories/${product.categoryId}`}
          className="transition duration-200 capitalize opacity-80 hover:opacity-100"
        >
          {product.category.name}
        </Link>
      </nav>

      {/* MAIN SECTION */}
      <section
        className="lg:mb-[5rem] sm:mb-[3.5rem] lg:grid lg:grid-cols-[3fr_4fr]
        sm:flex sm:flex-col sm:items-center lg:gap-8 sm:gap-5 mt-7 min-h-[25rem]"
      >
        {product.images.length === 1 ? (
          <Image
            key={product.images[0].id}
            src={product.images[0]?.path}
            alt={product.images[0]?.alt}
            width={400}
            height={400}
            className="justify-self-center my-auto"
          />
        ) : (
          <div className="lg:w-[85%] sm:w-[75%] justify-self-center">
            <ImageCarousel images={product.images} />
          </div>
        )}
        <div
          className="lg:col-start-2 lg:pr-10 flex flex-col lg:justify-between
        lg:h-full"
        >
          <div>
            <Link
              href={`/${product.brand}`}
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
                    <p className="opacity-85 max-sm:text-sm">{`${totalRating}/5 from ${reviews.length} rating`}</p>
                  ) : (
                    <p className="opacity-85 max-sm:text-sm">{`${totalRating}/5 from ${reviews.length} ratings`}</p>
                  )}
                </>
              ) : (
                <h3 className="text-stone-400">No ratings yet!</h3>
              )}
            </span>
          </div>
          <div className="mt-6 flex justify-center lg:gap-3 sm:gap-1">
            {(await prisma.cart.findFirst({
              where: { productId: id, userId: user?.id },
            })) ? (
              <ViewCartButton />
            ) : (
              <AddToCartButton className="w-[50%]" productId={id} />
            )}
            <BuyNowButton productId={id} />
          </div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section id="description" className="mb-[3rem]">
        <h1 className="max-sm:text-3xl/5">Description</h1>
        <TextClamp text={product.description} />
      </section>

      {/* SPECS SECTION */}
      {product.specs && (
        <section id="specs" className="mb-[3rem]">
          <h1 className="max-sm:text-3xl/5">Specifications</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Spec</TableHead>
                <TableHead>Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(product.specs!).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}

      {/* REVIEWS SECTION */}
      <section id="reviews" className="mb-[3rem]">
        <h1 className="max-sm:text-3xl/5">Reviews</h1>
        {reviews.length === 0 ? (
          <div className="mt-3 flex flex-col items-center">
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
                    <span className="flex justify-between items-center">
                      <h2 className="max-sm:text-xl">You</h2>
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
                  <h2 className="max-sm:text-xl">{review.user.name}</h2>
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

      {/* SUGGESTED SECTION */}
      <section id="suggested">
        <h1>Suggested for You</h1>
        <div className="overflow-x-auto scrollbar-hidden w-full">
          <div className="flex md:gap-3.5 sm:gap-1 md:w-max">
            {suggested
              .filter((product) => product.id !== id)
              .map((product) => (
                <div className="flex-shrink-0" key={product.id}>
                  <ProductCard
                    id={product.id}
                    className="md:w-[20rem] sm:w-[11.5rem] md:h-[27rem]"
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
