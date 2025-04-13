"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  productId: string;
}

const EditProductButton = ({ productId }: Props) => {
  const router = useRouter();
  const route = `/admin/products/manage/${productId}`;

  return (
    <Button
      className="w-full"
      variant="default"
      onClick={() => {
        router.push(route);
      }}
    >
      Edit
    </Button>
  );
};

export default EditProductButton;
