import Filter from "@/components/Filter";
import LongProductCard from "@/components/LongProductCard";
import ProductCard from "@/components/ProductCard";
import { Separator } from "@/components/ui/separator";
import ViewToggle from "@/components/ViewToggle";
import { titleCase } from "@/lib/titleCase";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: { category: string };
  searchParams: { brand?: string; view?: "grid" | "list" };
}

const CategoryPage = async ({
  params: { category },
  searchParams: { brand, view },
}: Props) => {
  const categoryId = await prisma.category.findFirst({
    where: { name: category },
    select: { id: true, name: true },
  });

  if (!categoryId) return notFound();

  let products = await prisma.product.findMany({
    where: { categoryId: categoryId.id },
    orderBy: { createdAt: "desc" },
  });

  if (brand)
    products = products.filter((product) => product.brand === titleCase(brand));

  return (
    <div>
      <div className="max-sm:mb-5 mb-10 flex flex-col items-center">
        <h2 className="max-sm:text-lg/5">CATEGORIES</h2>
        <h1 className="max-sm:text-5xl text-6xl text-center">
          {categoryId.name.toUpperCase()}
        </h1>
      </div>
      <div className="flex justify-end items-center mr-1 mb-5 gap-2">
        <ViewToggle />
        <Separator orientation="vertical" className="h-5 mr-2" />
        <Filter />
      </div>

      {(!view || view === "grid") && (
        <div
          className="grid sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-1 gap-5"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              className="md:h-[27rem]"
            />
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="grid max-lg:grid-cols-1 grid-cols-2 max-sm:gap-1 gap-5">
          {products.map((product) => (
            <LongProductCard key={product.id} id={product.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
