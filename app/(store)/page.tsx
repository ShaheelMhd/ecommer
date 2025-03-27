import ProductCard from "@/components/ProductCard";
import LongProductCard from "@/components/LongProductCard";
import { prisma } from "@/prisma/client";
import ImageCarousel from "@/components/ImageCarousel";

export default async function Home() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: {name: 'desc'},
  });
  const products = await prisma.product.findMany();

  return (
    <div>
      {categories.map((category) => (
        <div key={category.name} className="mb-10">
          <h1 className="capitalize">{category.name}</h1>
          <div className="grid grid-cols-4 gap-5">
            {products.map((product) =>
              product.categoryId === category.id && (
                <ProductCard key={product.id} id={product.id} />
              )
            )}
          </div>
        </div>
      ))}

      <h1>Long Product Card</h1>
      <div className="grid grid-cols-2 gap-5">
        {products.map((product) => (
          <LongProductCard key={product.id} id={product.id} />
        ))}
      </div>
    </div>
  );
}
