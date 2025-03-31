import Filter from "@/components/Filter";
import LongProductCard from "@/components/LongProductCard";
import ProductCard from "@/components/ProductCard";
import { Separator } from "@/components/ui/separator";
import ViewToggle from "@/components/ViewToggle";
import { titleCase } from "@/lib/titleCase";
import { prisma } from "@/prisma/client";

interface Props {
  params: { search: string };
  searchParams: { brand?: string; view?: "grid" | "list" };
}

const SearchPage = async ({
  params: { search },
  searchParams: { brand, view },
}: Props) => {
  search = search.split("-").join(" ");

  let products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  if (brand)
    products = products.filter((product) => product.brand === titleCase(brand));

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h1>Results for "{search}"</h1>
        <div className="flex items-center gap-2">
          {products.length > 0 && (
            <>
              <ViewToggle />
              <Separator orientation="vertical" className="h-5 mr-2" />
              <Filter />
            </>
          )}
        </div>
      </div>

      {(!view || view === "grid") && (
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
      )}

      {view === "list" && (
        <div className="grid grid-cols-2 gap-5">
          {products.length > 0 ? (
            products.map((product) => (
              <LongProductCard id={product.id} key={product.id} />
            ))
          ) : (
            <h2>No results found!</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
