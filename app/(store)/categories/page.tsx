import ProductCard from "@/components/ProductCard";
import { prisma } from "@/prisma/client";
import Link from "next/link";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Categories - Ecommer",
  description: "Explore the categories of products.",
};

const CategoriesPage = async () => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const products = await prisma.product.findMany();

  return (
    <>
      <h1 className="max-sm:text-5xl text-6xl mb-10 justify-self-center">
        CATEGORIES
      </h1>
      <div>
        {categories.map((category) => (
          <div key={category.name} className="mb-10">
            <div className="flex align-middle items-center gap-3 max-sm:mb-0 mb-5">
              <h1 className="capitalize mb-0 max-sm:text-3xl/5 max-sm:mb-7">
                {category.name}
              </h1>
              <Link
                href={`/categories/${category.name}`}
                className="text-blue-400 max-sm:mb-6 md:mt-1"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto scrollbar-hidden w-full">
              <div className="flex max-sm:gap-1 gap-6 w-max">
                {products.map((product) =>
                  product.categoryId === category.id ? (
                    <div key={product.id} className="flex-shrink-0">
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        className="max-sm:w-[11.125rem] w-[20rem] max-sm:h-[16.25rem]
                        h-[27rem]"
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoriesPage;
