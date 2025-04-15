"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const handleClick = async () => {
  const response = await fetch("/api/checkout", { method: "POST" });

  if (!response.ok) toast.error("Failed to checkout. Please try again.");
};

const CheckoutButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="default"
      className="w-full dark:bg-opacity-90"
      onClick={() => {
        handleClick();
        router.push("/orders");
      }}
    >
      Checkout
    </Button>
  );
};

export default CheckoutButton;
