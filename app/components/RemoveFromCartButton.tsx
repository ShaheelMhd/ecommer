"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  productId: string;
}

const RemoveFromCartButton = ({ productId }: Props) => {
  const handleRemoveFromCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from cart");
      }

      toast.success("Removed from cart!");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Button variant="destructive" onClick={handleRemoveFromCart}>
      Remove from cart
    </Button>
  );
};

export default RemoveFromCartButton;
