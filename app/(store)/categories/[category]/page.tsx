import ProductCard from "@/components/ProductCard";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: { category: string };
}

const CategoryPage = async ({ params: { category } }: Props) => {
  const categoryId = await prisma.category.findFirstOrThrow({
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
      {/* <h1 className="capitalize">{categoryId.name}</h1> */}
      <div className="grid grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard id={product.id} className="w-[20rem] h-[27rem]" />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
