"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";

interface Props {
  productId: string;
  className?: string;
}

const BuyNowButton = ({ className, productId }: Props) => {
  const handleClick = async () => {
    try {
      const buyNowResponse = await fetch("/api/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!buyNowResponse.ok) {
        throw new Error("Failed to checkout. Please try again.");
      }

      toast.success("Order placed", {
        action: {
          label: "View Orders",
          onClick: () => {
            window.location.href = "/orders";
          },
        },
      });
    } catch (error) {
      console.error("Error checking out:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <Button
      className={`w-[50%] ${className}`}
      variant="default"
      onClick={handleClick}
    >
      Buy Now
    </Button>
  );
};

export default BuyNowButton;
