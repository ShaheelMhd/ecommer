"use client";

import { Button } from "@/components/ui/button";

const ViewCartButton = () => {
  const handleClick = () => {
    window.location.href = "/cart";
  };

  return (
    <Button variant="secondary" className="w-[50%]" onClick={handleClick}>
      View Cart
    </Button>
  );
};

export default ViewCartButton;
