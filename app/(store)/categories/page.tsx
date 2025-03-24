import ProductCard from "@/components/ProductCard";
import { prisma } from "@/prisma/client";
import Link from "next/link";

interface Props {
  searchParams: { category: string };
}

const CategoriesPage = async ({ searchParams: { category } }: Props) => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  const products = await prisma.product.findMany();

  return (
    <>
      <h1 className="text-6xl mb-10 justify-self-center">CATEGORIES</h1>
      <div>
        {categories.map((category) => (
          <div key={category.name} className="mb-10">
            <div className="flex align-middle items-center gap-3 mb-5">
              <h1 className="capitalize mb-0">{category.name}</h1>
              <Link
                href={`/categories/${category.name}`}
                className="text-blue-400 mt-1"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto scrollbar-hidden w-full">
              <div className="flex gap-6 w-max">
                {products.map((product) =>
                  product.categoryId === category.id ? (
                    <div className="flex-shrink-0">
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        className="w-[20rem] h-[27rem]"
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
