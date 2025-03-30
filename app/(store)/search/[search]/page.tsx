import ProductCard from "@/components/ProductCard";
import { prisma } from "@/prisma/client";
import React from "react";

interface Props {
  params: { search: string };
}

const SearchPage = async ({ params: { search } }: Props) => {
  search = search.split("-").join(" ");

  const products = await prisma.product.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1>Results for "{search}"</h1>
      <div className="grid grid-cols-4 gap-3.5">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              id={product.id}
              key={product.id}
              className="w-[20rem] h-[27rem] mb-3"
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
