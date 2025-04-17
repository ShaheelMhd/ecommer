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
      <div className="flex max-sm:flex-col justify-between mb-2">
        <h1>Results for "{search}"</h1>
        <div
          className="flex max-sm:justify-end max-sm:mb-5 max-sm:mr-2
        items-center gap-2"
        >
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
        <div
          className="grid sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-1 gap-5"
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                id={product.id}
                key={product.id}
                className="md:h-[27rem] mb-3"
              />
            ))
          ) : (
            <h2>No results found!</h2>
          )}
        </div>
      )}

      {view === "list" && (
        <div className="grid max-lg:grid-cols-1 grid-cols-2 max-sm:gap-1 gap-5">
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
