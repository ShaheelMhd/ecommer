"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

interface Props {
  productId: string;
}

const DeleteProductButton = ({ productId }: Props) => {
  const handleDelete = async () => {
    await fetch(`/api/products/delete?id=${productId}`, {
      method: "DELETE",
    });

    toast.success("Product deleted successfully");
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete Product
    </Button>
  );
};

export default DeleteProductButton;
