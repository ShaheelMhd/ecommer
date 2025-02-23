"use client";

import { Button } from "@/components/ui/button";
import { Router } from "next/router";
import React from "react";

const GoToCartButton = () => {
  const handleClick = () => {
    window.location.href = "/cart";
  };

  return (
    <Button variant="secondary" className="w-[50%]" onClick={handleClick}>
      Go To Cart
    </Button>
  );
};

export default GoToCartButton;
