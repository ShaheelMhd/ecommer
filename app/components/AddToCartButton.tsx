"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// productId from ProductCard -- already made a prisma call there
interface Props {
  productId: string;
  className?: string;
}

const AddToCartButton = ({ productId, className }: Props) => {
  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Button className={className} variant="secondary" onClick={handleAddToCart}>
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
