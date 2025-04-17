"use client";

import React from "react";
import { Button } from "./ui/button";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

interface Props {
  productId: string;
}

const DeleteReviewButton = ({ productId }: Props) => {
  const handleClick = async () => {
    try {
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
        }),
      });
      toast.success("Review deleted!");

      if (!response.ok) throw new Error("Failed to delete review!");
    } catch (error) {
      toast.error("Failed to delete review!");
      console.error(error);
    }
  };

  return (
    <Button size="sm" variant="destructive" onClick={handleClick}>
      <MdDelete className="scale-125" />
    </Button>
  );
};

export default DeleteReviewButton;
