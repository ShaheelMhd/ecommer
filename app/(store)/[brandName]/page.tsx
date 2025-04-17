import LongProductCard from "@/components/LongProductCard";
import ProductCard from "@/components/ProductCard";
import ViewToggle from "@/components/ViewToggle";
import { titleCase } from "@/lib/titleCase";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: { brandName: string };
  searchParams: { view?: "grid" | "list" };
}

type Product = {
  name: string;
  id: string;
  price: number;
  categoryId: string;
  category: {
    name: string;
  };
};

const BrandPage = async ({
  params: { brandName },
  searchParams: { view },
}: Props) => {
  brandName = titleCase(brandName.split("-").join(" "));

  const products = await prisma.product.findMany({
    where: { brand: brandName },
    select: {
      id: true,
      name: true,
      price: true,
      categoryId: true,
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) return notFound();

  // returns an object: { 'categoryId': { [Product] } }
  const productCategories = products.reduce<{ [key: string]: Product[] }>(
    (acc, product) => {
      if (!acc[product.categoryId]) {
        acc[product.categoryId] = [];
      }
      acc[product.categoryId].push(product);
      return acc;
    },
    {}
  );

  return (
    <>
      <div className="mb-10 flex flex-col items-center relative">
        <h2 className="max-sm:text-lg/5">BRAND STORE</h2>
        <h1 className="max-sm:text-5xl text-6xl">{brandName.toUpperCase()}</h1>
        <ViewToggle className="absolute right-0 top-[9.7rem] max-sm:top-[7.6rem]" />
      </div>

      {/* to render products by their categories */}
      <div>
        {Object.entries(productCategories).map(([categoryId, products]) => (
          <div key={categoryId} className="mb-10">
            <h1 className="max-sm:text-3xl/5 max-sm:mb-7">
              {titleCase(products[0].category.name)}
            </h1>

            {(!view || view === "grid") && (
              <div
                className="grid sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-1 gap-3"
              >
                {products.map((product) => (
                  <ProductCard id={product.id} key={product.id} />
                ))}
              </div>
            )}

            {view === "list" && (
              <div className="grid max-lg:grid-cols-1 grid-cols-2 max-sm:gap-1 gap-3">
                {products.map((product) => (
                  <LongProductCard id={product.id} key={product.id} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default BrandPage;
