"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  userId?: string;
  cartProduct: {
    product: {
      images: {
        productId: string;
        path: string;
        id: string;
        alt: string;
        createdAt: Date;
        isPrimary: boolean;
      }[];
    } & {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      description: string;
      price: number;
      stock: number;
      categoryId: string;
    };
    quantity: number;
  };
  fetchCart: () => void;
}

const QuantitySelector = ({ userId, cartProduct, fetchCart }: Props) => {
  const [quantity, setQuantity] = useState(cartProduct.quantity);

  const handleQuantity = async (value: string) => {
    const newQuantity = parseInt(value);
    setQuantity(newQuantity);

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: cartProduct.product.id,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Quantity updated successfully!");
        fetchCart(); // fetches the cart again in parent component
      } else {
        toast.error(`Failed to update quantity: ${data.error}`);
      }
    } catch (error) {
      toast.error("Failed to update quantity.");
      console.error("Error:", error);
    }
  };

  return (
    <Select value={String(quantity)} onValueChange={handleQuantity}>
      <SelectTrigger>
        <SelectValue>{`Qty: ${quantity}`}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Quantity</SelectLabel>
          {[...Array(10)].map((_, index) => {
            const value = index + 1;
            return (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default QuantitySelector;
