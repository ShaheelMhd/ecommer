import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center
    sm:w-[85%] md:w-[65%] lg:w-[55%] xl:w-[40%]"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
