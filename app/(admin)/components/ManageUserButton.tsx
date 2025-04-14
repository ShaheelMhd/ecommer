"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  userId: string;
}

const ManageUserButton = ({ userId }: Props) => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`/admin/users/manage/${userId}`)}>
      Manage
    </Button>
  );
};

export default ManageUserButton;
