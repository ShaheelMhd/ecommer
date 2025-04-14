"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

interface Props {
  userId: string;
}

const DeleteUserButton = ({ userId }: Props) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/delete?id=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.log("Error deleting user:", error);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Remove
    </Button>
  );
};

export default DeleteUserButton;
