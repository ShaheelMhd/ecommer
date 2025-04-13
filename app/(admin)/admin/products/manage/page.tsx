import ManageProductCard from "@/app/(admin)/components/ManageProductCard";
import { prisma } from "@/prisma/client";

const ManageProductsHomePage = async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-5">Manage Products</h1>
      <div className="grid grid-cols-4 gap-5">
        {products.map((product) => (
          <ManageProductCard key={product.id} id={product.id} />
        ))}
      </div>
    </div>
  );
};

export default ManageProductsHomePage;
