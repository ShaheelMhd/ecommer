import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import ManageProductForm from "./ManageProductForm";

interface Props {
  params: { id: string };
}

const ManageProductPage = async ({ params: { id } }: Props) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });

  if (!product) return notFound();

  return (
    <div>
      <h1 className="line-clamp-1">Manage Product: {product?.name}</h1>
      <div>
        <ManageProductForm product={product} />
      </div>
    </div>
  );
};

export default ManageProductPage;
