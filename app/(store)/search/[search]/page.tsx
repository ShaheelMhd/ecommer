import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";
import { titleCase } from "@/lib/titleCase";
import { prisma } from "@/prisma/client";

interface Props {
  params: { search: string };
  searchParams: { brand?: string };
}

const SearchPage = async ({
  params: { search },
  searchParams: { brand },
}: Props) => {
  search = search.split("-").join(" ");

  let products = await prisma.product.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

  if (brand)
    products = products.filter((product) => product.brand === titleCase(brand));

  return (
    <div>
      <div className="flex justify-between">
        <h1>Results for "{search}"</h1>
        <Filter />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              id={product.id}
              key={product.id}
              className="h-[27rem] mb-3" // w-[20.3rem] if needed
            />
          ))
        ) : (
          <h2>No results found!</h2>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
