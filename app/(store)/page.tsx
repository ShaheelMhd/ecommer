import ProductCard from "@/components/ProductCard";
import LongProductCard from "@/components/LongProductCard";
import { prisma } from "@/prisma/client";

export default async function Home() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "desc" },
  });
  const products = await prisma.product.findMany();

  return (
    <div>
      {categories.map((category) => (
        <div key={category.name} className="mb-10">
          <h1 className="capitalize max-sm:text-3xl/5">{category.name}</h1>
          <div
            className="grid sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-1 gap-3"
          >
            {products.map(
              (product) =>
                product.categoryId === category.id && (
                  <ProductCard key={product.id} id={product.id} />
                )
            )}
          </div>
        </div>
      ))}

      <h1>Long Product Card</h1>
      <div className="grid max-lg:grid-cols-1 grid-cols-2 max-sm:gap-1 gap-3">
        {products.map((product) => (
          <LongProductCard key={product.id} id={product.id} />
        ))}
      </div>
    </div>
  );
}
