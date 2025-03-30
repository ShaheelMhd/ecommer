import Filter from "@/components/Filter";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: { category: string };
}

const CategoryPage = async ({ params: { category } }: Props) => {
  const categoryId = await prisma.category.findFirst({
    where: { name: category },
    select: { id: true, name: true },
  });

  if (!categoryId) return notFound();

  const products = await prisma.product.findMany({
    where: { categoryId: categoryId.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-10 flex flex-col items-center">
        <h2>CATEGORIES</h2>
        <h1 className="text-6xl">{categoryId.name.toUpperCase()}</h1>
      </div>
      <div className="flex justify-end mb-5">
        <Filter />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard id={product.id} className="h-[27rem]" /> // w-[20.3rem] if needed
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
