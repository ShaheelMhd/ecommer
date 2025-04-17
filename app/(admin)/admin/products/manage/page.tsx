import ManageProductCard from "@/app/(admin)/components/ManageProductCard";
import { prisma } from "@/prisma/client";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Manage Products - Ecommer",
  description: "Manage the products in the store.",
};

const ManageProductsHomePage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-5">Manage Products</h1>
      <div
        className="grid sm:grid-cols-2 md:grid-cols-2
          lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-1 gap-3"
      >
        {products.map((product) => (
          <ManageProductCard key={product.id} id={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ManageProductsHomePage;
