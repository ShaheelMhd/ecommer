import DeleteProductButton from "@/app/(admin)/components/DeleteProductButton";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import ManageProductForm from "./ManageProductForm";
import { JsonValue } from "@prisma/client/runtime/library";

interface Props {
  params: { id: string };
}

type Product = {
  category: {
    name: string;
  };
} & {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  specs: JsonValue | object | null;
  brand: string;
  price: number;
  stock: number;
  categoryId: string;
} | null;

const ManageProductPage = async ({ params: { id } }: Props) => {
  const product: Product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { name: true } } },
  });

  if (!product) return notFound();

  return (
    <div>
      <div className="flex justify-between align-middle items-center mb-5">
        <h1 className="line-clamp-1 mb-0 max-sm:text-3xl max-sm:whitespace-nowrap">
          Manage Product: {product?.name}
        </h1>
        <DeleteProductButton productId={id} />
      </div>
      <div>
        <ManageProductForm product={product} />
      </div>
    </div>
  );
};

export default ManageProductPage;
