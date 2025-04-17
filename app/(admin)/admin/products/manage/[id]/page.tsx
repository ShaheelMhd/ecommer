import { Button } from "@/components/ui/button";
import { prisma } from "@/prisma/client";
import { notFound } from "next/navigation";
import ManageProductForm from "./ManageProductForm";
import { toast } from "sonner";
import DeleteProductButton from "@/app/(admin)/components/DeleteProductButton";

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
