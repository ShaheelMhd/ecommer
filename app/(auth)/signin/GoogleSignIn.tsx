"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import { FaGoogle } from "react-icons/fa";

async function handleSignIn() {
  await signIn("google");
}

const GoogleSignIn = () => {
  return (
    <Button className="p-6 text-md w-full" onClick={handleSignIn}>
      <FaGoogle className="mr-1" />
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;
